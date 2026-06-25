# Kedbyte — Company Website

A premium, cinematic, multi-page marketing website for **Kedbyte Private Limited** — an ultra-minimal, futuristic software studio (Custom Software, AI/ML, Cloud Infrastructure & Automation, UI/UX Design).

Built with **React 19 + FastAPI + MongoDB**, with Framer Motion animations, Lenis smooth scroll, a custom cursor, an animated hero terminal, route transition curtains, and a working contact form (email via Resend).

---

## ✨ Features

- **5 pages**: Home, Services, About, Careers, Contact (+ custom 404)
- Cinematic kinetic hero, animated tech grid, glow orbs, stat counters
- Custom cursor, magnetic buttons, scroll progress bar, page-transition curtain
- Tech-stack marquee, framed bento service cards
- Contact form → stores submissions in MongoDB + sends email via **Resend**
- Fully responsive, dark, ultra-minimal design

---

## 🧱 Tech Stack

| Layer     | Tech |
|-----------|------|
| Frontend  | React 19, React Router 7, TailwindCSS, Framer Motion, Lenis, lucide-react, react-icons, sonner |
| Backend   | FastAPI, Motor (async MongoDB), Pydantic, Resend |
| Database  | MongoDB |
| Tooling   | CRACO, Yarn, Python 3 / pip |

---

## 📁 Project Structure

```
/app
├── backend
│   ├── server.py            # FastAPI app — /api/contact, /api/contacts
│   ├── requirements.txt
│   └── .env                 # MONGO_URL, DB_NAME, RESEND_API_KEY, etc.
└── frontend
    ├── src
    │   ├── App.js           # Routes, Lenis, cursor, curtain
    │   ├── components/      # Header, Footer, Layout, TerminalCard, Cursor, etc.
    │   └── pages/           # Home, Services, About, Careers, Contact, NotFound
    ├── public/
    ├── package.json
    └── .env                 # REACT_APP_BACKEND_URL
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+ and **Yarn** (do not use npm)
- Python 3.10+
- MongoDB running locally (or a connection string)

### 1. Clone
```bash
git clone <your-repo-url>
cd <repo>
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="kedbyte"
CORS_ORIGINS="*"
RESEND_API_KEY=""                       # optional — leave empty to skip sending
SENDER_EMAIL="onboarding@resend.dev"
CONTACT_RECIPIENT_EMAIL="techteam@kedbyte.com"
```

Run the API:
```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### 3. Frontend
```bash
cd frontend
yarn install
```

Create `frontend/.env`:
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

Run the app:
```bash
yarn start
```

App runs at `http://localhost:3000`, API at `http://localhost:8001`.

> **Note:** All backend routes are prefixed with `/api`. The frontend always calls `${REACT_APP_BACKEND_URL}/api/...`.

---

## ✉️ Enabling Contact-Form Emails (Resend)

The contact form **always stores submissions** in MongoDB. Email delivery is optional and turns on once you add a Resend key.

1. Create a free account at https://resend.com
2. **API Keys → Create API Key** (starts with `re_...`)
3. Add it to `backend/.env`:
   ```
   RESEND_API_KEY="re_xxxxxxxxxxxx"
   CONTACT_RECIPIENT_EMAIL="you@yourdomain.com"
   ```
4. (Optional) Verify your domain in Resend and set `SENDER_EMAIL` to an address on that domain. Until then, Resend test mode only delivers to your own verified email and sends from `onboarding@resend.dev`.
5. Restart the backend.

---

## 🔌 API Reference

| Method | Endpoint        | Description |
|--------|-----------------|-------------|
| GET    | `/api/`         | Health check |
| POST   | `/api/contact`  | Submit contact form `{name, email, company, budget, message}` → stores + emails |
| GET    | `/api/contacts` | List all submissions (newest first) |

Example:
```bash
curl -X POST http://localhost:8001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@acme.com","company":"Acme","budget":"$10k","message":"Hi"}'
```

---

## 🛠 Customizing Content

- **Services / copy**: `frontend/src/pages/*.jsx` (each page has a top-level data array)
- **Open roles**: `frontend/src/pages/Careers.jsx` → `roles` array
- **Nav & footer links**: `frontend/src/components/Header.jsx` / `Footer.jsx`
- **Colors & fonts**: `frontend/src/index.css` + `frontend/tailwind.config.js`
- **Hero terminal lines**: `frontend/src/components/TerminalCard.jsx`
- **Favicon / tab title / SEO**: `frontend/public/index.html`

---

## 🏢 Company

**Kedbyte Private Limited** · Incorporated 08 May 2026 · Vadodara, Gujarat, India
Email: techteam@kedbyte.com · Web: kedbyte.com

---

## 📦 Production Build

```bash
cd frontend && yarn build      # outputs static build/
# Serve backend with a production ASGI setup (e.g. uvicorn/gunicorn) behind your reverse proxy
```

Set production environment variables (`REACT_APP_BACKEND_URL`, `MONGO_URL`, `RESEND_API_KEY`) for your hosting provider.
