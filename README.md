# Kedbyte — Company Website & API

The marketing site and contact/lead API for **Kedbyte Private Limited**, an
ultra-minimal software studio (custom software, applied AI/ML, blockchain &
Web3, cloud infrastructure & automation) in Vadodara, India — plus the
product page for **Kedbyte Payroll** (in development).

**Live domain:** https://kedbyte.com

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 (CRA + craco), React Router 7, Tailwind CSS, Framer Motion, Lenis smooth scroll |
| Backend | FastAPI, Motor (async MongoDB), Pydantic v2, Resend (email) |
| Database | MongoDB (`kedbyte` db, `contacts` collection) |
| E2E | Playwright (4 device projects) + axe-core accessibility scans |

Routes: `/`, `/services`, `/payroll`, `/about`, `/careers`, `/contact`, and a
custom 404. The contact form and the Payroll early-access funnel both POST to
`/api/contact` (per-IP rate limiting, validation, honeypot); stored leads get
an internal notification plus a branded confirmation email to the submitter.

## Local development

Prerequisites: Node 18+, Yarn, Python 3.11+, a local MongoDB on
`mongodb://localhost:27017`.

**Backend** (port 8001):

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Frontend** (port 3001):

```bash
cd frontend
yarn install
cp .env.example .env
yarn start
```

Sanity check: http://localhost:3001 loads the site,
`curl http://localhost:8001/api/health` returns `{"status":"ok"}`.

The `.env` files are gitignored and must never be committed; the tracked
`.env.example` files document every variable. Email sending is skipped
whenever `RESEND_API_KEY` is unset — submissions are still stored.

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check → `{"status":"ok"}` |
| POST | `/api/contact` | Store a submission `{name, email, company?, budget?, message, source?}`; rate-limited per IP (5/min, 20/h) |
| GET | `/api/contacts` | Lead export — requires `x-admin-token` header; 404 unless `ADMIN_TOKEN` is configured |

## E2E suite

Requires both dev servers and MongoDB running, and
`E2E_BYPASS_TOKEN=kedbyte-e2e-local` in `backend/.env` (the suite bypasses
the rate limiter for most specs and deliberately triggers it in one).

```bash
cd e2e
npm install
npx playwright install
npx playwright test                          # all projects (~7 min)
npx playwright test --project=desktop-chrome # one project
```

Projects: `desktop-chrome` (1512×982), `iphone-14-pro` (WebKit),
`iphone-se` (smoke/layout only), `pixel-7` (smoke/layout/perf). The `a11y`
spec runs axe-core across every route and fails on any violation.

## Editing content

- Page copy / services / roles: `frontend/src/pages/*.jsx` and `frontend/src/data/*.js`
- Nav & footer links: `frontend/src/components/Header.jsx` / `Footer.jsx`
- Colors & fonts: `frontend/src/index.css` + `frontend/tailwind.config.js`
- SEO / meta / OG: `frontend/public/index.html` (static defaults) and the `META` map in `frontend/src/components/Layout.jsx` (per-route)
- Confirmation email templates: `backend/emails.py`

## Production build

```bash
cd frontend
REACT_APP_BACKEND_URL=https://api.kedbyte.com yarn build
```

The build is fully static and self-contained (self-hosted images, favicons,
`.htaccess` for Apache SPA rewrites/caching, sitemap, robots, OG image).

## Deployment

See **[DEPLOY_RUNBOOK.md](DEPLOY_RUNBOOK.md)** — ordered steps for MongoDB
Atlas, Render (backend, via `render.yaml`), Hostinger shared hosting
(frontend), DNS, Resend domain verification, SSL, and post-deploy
verification.

---

**Kedbyte Private Limited** · Incorporated 08 May 2026 · Vadodara, Gujarat, India
· techteam@kedbyte.com
