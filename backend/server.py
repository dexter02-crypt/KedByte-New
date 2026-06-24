from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
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

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend config
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
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
class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = ""
    budget: Optional[str] = ""
    message: str


class Contact(BaseDocument):
    name: str
    email: str
    company: Optional[str] = ""
    budget: Optional[str] = ""
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ----- Email helper -----
def _build_email_html(c: ContactCreate) -> str:
    return f"""
    <div style="font-family:Arial,sans-serif;background:#050505;padding:32px;color:#ffffff;">
      <table width="100%" style="max-width:600px;margin:0 auto;background:#121212;border-radius:12px;padding:32px;">
        <tr><td>
          <h2 style="color:#00F0FF;margin:0 0 16px;">New Kedbyte Enquiry</h2>
          <p style="color:#A1A1AA;margin:0 0 24px;">You received a new message from the website contact form.</p>
          <p style="margin:6px 0;"><strong>Name:</strong> {c.name}</p>
          <p style="margin:6px 0;"><strong>Email:</strong> {c.email}</p>
          <p style="margin:6px 0;"><strong>Company:</strong> {c.company or '-'}</p>
          <p style="margin:6px 0;"><strong>Budget:</strong> {c.budget or '-'}</p>
          <p style="margin:16px 0 6px;"><strong>Message:</strong></p>
          <p style="margin:0;color:#A1A1AA;line-height:1.6;">{c.message}</p>
        </td></tr>
      </table>
    </div>
    """


async def _send_contact_email(c: ContactCreate):
    if not RESEND_API_KEY or not CONTACT_RECIPIENT_EMAIL:
        logger.info("Resend not configured; skipping email send.")
        return None
    params = {
        "from": SENDER_EMAIL,
        "to": [CONTACT_RECIPIENT_EMAIL],
        "reply_to": c.email,
        "subject": f"New enquiry from {c.name} — Kedbyte",
        "html": _build_email_html(c),
    }
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        return result.get("id") if isinstance(result, dict) else None
    except Exception as e:
        logger.error(f"Failed to send contact email: {e}")
        return None


# ----- Routes -----
@api_router.get("/")
async def root():
    return {"message": "Kedbyte API is live"}


@api_router.post("/contact")
async def create_contact(payload: ContactCreate):
    contact = Contact(**payload.model_dump())
    await db.contacts.insert_one(contact.to_mongo())
    email_id = await _send_contact_email(payload)
    return {
        "status": "success",
        "message": "Thanks for reaching out. Our team will get back to you shortly.",
        "email_sent": bool(email_id),
    }


@api_router.get("/contacts", response_model=List[Contact], response_model_by_alias=False)
async def list_contacts():
    docs = await db.contacts.find().sort("created_at", -1).to_list(500)
    return [Contact.from_mongo(d) for d in docs]


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
