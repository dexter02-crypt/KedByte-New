# Kedbyte Technologies — Company Website (PRD)

## Original Problem Statement
Build a full-fledged, award-winning animated multi-page marketing website for **Kedbyte Technologies Private Limited** (brand: Kedbyte), a full-service SaaS/tech company. Reference floema.com for cinematic animations & scroll effects (inspiration, not copy). User choices: full-service company (software/SaaS + Cloud/DevOps + AI/Data); multi-page; contact form sends real emails (Resend); bold award-winning dark design; generate all content/images.

## Architecture
- **Frontend**: React 19 + React Router 7, TailwindCSS, Framer Motion (animations/page transitions), Lenis (smooth scroll), react-fast-marquee, react-icons, sonner (toasts).
- **Backend**: FastAPI + Motor (MongoDB). Resend for transactional email.
- Pages: Home, Services, About, Careers, Contact. Shared Header/Footer/Layout, reusable Reveal, MagneticButton, Counter, TechMarquee, CTASection components.

## Personas
- Prospective B2B client evaluating a tech partner.
- Candidate exploring careers.

## Implemented (2026-06-24)
- Cinematic Home: kinetic hero (parallax bg, staggered word reveal), tech marquee, services bento grid, animated stat counters, CTA.
- Services (4 detailed alternating blocks), About (story + values + stats), Careers (expandable role accordion + open application), Contact (split layout, brutalist form).
- Backend: `POST /api/contact` (stores in MongoDB `contacts`, sends email via Resend when configured), `GET /api/contacts`. Graceful no-key behavior (stores, skips email).
- Smooth scroll, page transitions, magnetic buttons, glassmorphic header, grain overlay.
- Tested: 100% backend (6/6) + frontend (11/11 flows).

## Backlog
- **P0**: Add `RESEND_API_KEY` + verified sender/recipient so emails actually deliver (currently email_sent=false; submissions still stored).
- **P1**: Case studies / portfolio page; blog/insights; rate-limiting on contact endpoint.
- **P2**: Admin view for submissions; i18n; CMS for careers roles.

## Next Action Items
- Collect Resend API key + recipient email from user to enable real email delivery.
