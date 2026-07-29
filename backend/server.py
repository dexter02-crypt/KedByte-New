from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import time
from collections import defaultdict, deque
from pydantic import field_validator
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Annotated
from datetime import datetime, timezone
from bson import ObjectId
from pydantic import BeforeValidator
import resend

from emails import build_confirmation_email, build_lead_notification_email

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend config
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
SENDER_HEADER = f"Kedbyte <{SENDER_EMAIL}>"
CONTACT_RECIPIENT_EMAIL = os.environ.get('CONTACT_RECIPIENT_EMAIL', '')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

PyObjectId = Annotated[str, BeforeValidator(str)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    @classmethod
    def from_mongo(cls, doc):
        if not doc:
            return None
        return cls(**doc)

    def to_mongo(self):
        data = self.model_dump(by_alias=True, exclude_none=True)
        data.pop("_id", None)
        return data


# ----- Models -----
KNOWN_BUDGETS = {"", "< $10k", "$10k \u2013 $50k", "$50k \u2013 $150k", "$150k+", "Not sure yet"}


class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr = Field(max_length=320)
    company: Optional[str] = Field(default="", max_length=200)
    budget: Optional[str] = ""
    message: str = Field(min_length=1, max_length=5000)
    # Optional lead tag, e.g. "payroll-early-access"; "" = general contact
    source: Optional[str] = Field(default="", max_length=100)
    # Honeypot: real users never see or fill this field
    website: Optional[str] = Field(default="", max_length=500)

    @field_validator("name", "company", "message", "source", mode="before")
    @classmethod
    def _strip(cls, v):
        return v.strip() if isinstance(v, str) else v

    @field_validator("budget")
    @classmethod
    def _known_budget(cls, v):
        v = (v or "").strip()
        if v not in KNOWN_BUDGETS:
            raise ValueError("unknown budget range")
        return v


class Contact(BaseDocument):
    name: str
    email: str
    company: Optional[str] = ""
    budget: Optional[str] = ""
    message: str
    source: Optional[str] = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ----- Email helper -----
async def _send_contact_email(c: ContactCreate):
    if not RESEND_API_KEY or not CONTACT_RECIPIENT_EMAIL:
        logger.info("Resend not configured; skipping email send.")
        return None
    tpl = build_lead_notification_email(
        name=c.name,
        email=c.email,
        company=c.company or "",
        budget=c.budget or "",
        message=c.message,
        source=c.source or "",
    )
    params = {
        "from": SENDER_HEADER,
        "to": [CONTACT_RECIPIENT_EMAIL],
        "reply_to": c.email,
        "subject": tpl["subject"],
        "html": tpl["html"],
        "text": tpl["text"],
    }
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        return result.get("id") if isinstance(result, dict) else None
    except Exception as e:
        logger.error(f"Failed to send contact email: {e}")
        return None


async def _send_confirmation_email(c: ContactCreate):
    """Branded auto-confirmation to the submitter.

    Only called after validation, honeypot and rate-limit checks pass AND
    the submission is stored. Must never fail the API response.
    """
    if not RESEND_API_KEY:
        logger.info("Resend not configured; skipping confirmation email.")
        return None
    tpl = build_confirmation_email(
        name=c.name, company=c.company or "", message=c.message, source=c.source or ""
    )
    params = {
        "from": SENDER_HEADER,
        "to": [c.email],
        "subject": tpl["subject"],
        "html": tpl["html"],
        "text": tpl["text"],
    }
    # Replies to the confirmation should reach a human inbox.
    if CONTACT_RECIPIENT_EMAIL:
        params["reply_to"] = CONTACT_RECIPIENT_EMAIL
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        email_id = result.get("id") if isinstance(result, dict) else None
        logger.info("Confirmation email sent to submitter (id=%s)", email_id)
        return email_id
    except Exception as e:
        logger.error(f"Failed to send confirmation email: {e}")
        return None


# ----- Routes -----
@api_router.get("/")
async def root():
    return {"message": "Kedbyte API is live"}


@api_router.get("/health")
async def health():
    return {"status": "ok"}


# ---- Per-IP rate limiting (in-memory sliding windows) ----
RATE_MINUTE, RATE_HOUR = 5, 20
_hits: dict = defaultdict(deque)
E2E_BYPASS_TOKEN = os.environ.get("E2E_BYPASS_TOKEN", "")


def _client_ip(request: Request) -> str:
    """Real client IP behind Render's proxy (first X-Forwarded-For hop).

    uvicorn --proxy-headers rewrites request.client.host too; this keeps the
    limiter per-client even if the flag is dropped from the start command.
    """
    fwd = request.headers.get("x-forwarded-for", "")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _rate_limited(ip: str) -> bool:
    now = time.time()
    dq = _hits[ip]
    while dq and now - dq[0] > 3600:
        dq.popleft()
    last_minute = sum(1 for t in dq if now - t <= 60)
    if last_minute >= RATE_MINUTE or len(dq) >= RATE_HOUR:
        return True
    dq.append(now)
    return False


@api_router.post("/contact")
async def create_contact(payload: ContactCreate, request: Request):
    ip = _client_ip(request)
    bypass = bool(E2E_BYPASS_TOKEN) and request.headers.get("x-e2e-bypass") == E2E_BYPASS_TOKEN
    if not bypass and _rate_limited(ip):
        return JSONResponse(
            status_code=429,
            content={
                "status": "rate_limited",
                "message": "Too many requests. Please try again in a minute.",
            },
        )

    # Honeypot: pretend success, store nothing
    if payload.website:
        logger.warning("honeypot tripped from %s (name=%r)", ip, payload.name[:40])
        return {
            "status": "success",
            "message": "Thanks for reaching out. Our team will get back to you shortly.",
            "email_sent": False,
        }

    data = payload.model_dump()
    data.pop("website", None)
    contact = Contact(**data)
    await db.contacts.insert_one(contact.to_mongo())
    email_id = await _send_contact_email(payload)
    # Confirmation to the submitter — only for stored submissions (the
    # honeypot and rate-limit paths returned above) and never fatal.
    await _send_confirmation_email(payload)
    return {
        "status": "success",
        "message": "Thanks for reaching out. Our team will get back to you shortly.",
        "email_sent": bool(email_id),
    }


# Lead export — disabled unless ADMIN_TOKEN is configured; never public.
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")


@api_router.get("/contacts", response_model=List[Contact], response_model_by_alias=False)
async def list_contacts(request: Request):
    if not ADMIN_TOKEN or request.headers.get("x-admin-token") != ADMIN_TOKEN:
        raise HTTPException(status_code=404, detail="Not found")
    docs = await db.contacts.find().sort("created_at", -1).to_list(500)
    return [Contact.from_mongo(d) for d in docs]


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[o.strip() for o in os.environ.get('CORS_ORIGINS', '*').split(',') if o.strip()],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
