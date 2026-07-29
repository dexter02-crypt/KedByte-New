# Kedbyte — Deployment Runbook

Target architecture:

| Piece | Where | How |
|---|---|---|
| Frontend (static CRA build) | Hostinger shared hosting, `public_html` | manual upload of `kedbyte-frontend-deploy.zip` |
| Backend (FastAPI) | Render free tier, from this GitHub repo (`backend/`) | auto-deploy on push |
| Database | MongoDB Atlas (free M0) | connection string in Render env |
| Email | Resend | API key in Render env, domain verified via DNS |
| Domain / DNS | kedbyte.com — Hostinger nameservers, hPanel DNS zone editor | records in Step 3 |

Execute the steps **in order** — each one feeds a value into the next
(Atlas → connection string → Render; Render → CNAME target → DNS; Resend →
DNS records + API key → Render).

Decisions you make along the way are marked **DECISION**.

---

## Step 1 — MongoDB Atlas

1. Create a free account at https://cloud.mongodb.com → **Build a Database**
   → **M0 Free** tier.
   - **DECISION — region:** pick the region closest to your Render service
     region (choose the same answer in Step 2; e.g. both in Singapore, or
     both in Frankfurt/Oregon). Latency between Render and Atlas dominates
     API response time.
2. **Database Access** → Add New Database User:
   - Auth method: password. Username e.g. `kedbyte-api`.
   - Use the auto-generated password (no `@ : / ?` characters — they break
     the connection URL unless percent-encoded). Save it.
   - Role: **Read and write to any database** (or scope to the `kedbyte` db).
3. **Network Access** → Add IP Address → **Allow access from anywhere
   (0.0.0.0/0)**.
   - *Why:* Render's free tier has no static outbound IPs, so you cannot
     allow-list them. The connection is still TLS-encrypted and
     password-authenticated; 0.0.0.0/0 only widens who may *attempt* to
     authenticate. If this ever becomes uncomfortable, the upgrade path is
     Render's static-IP add-on or Atlas Private Link (both paid).
4. **Database → Connect → Drivers** and copy the connection string:

   ```
   mongodb+srv://kedbyte-api:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   ```

   Keep it — it becomes `MONGO_URL` in Step 2. The database (`kedbyte`) and
   the `contacts` collection are created automatically on first insert.

## Step 2 — Render (backend)

1. https://dashboard.render.com → **New → Web Service** → connect the
   GitHub repo `dexter02-crypt/KedByte-New`.
2. Settings (these mirror `render.yaml` at the repo root — you can also use
   **New → Blueprint** and skip the manual form):

   | Setting | Value |
   |---|---|
   | Name | `kedbyte-api` (becomes `kedbyte-api.onrender.com`) |
   | Language | Python 3 |
   | Root Directory | `backend` |
   | Build Command | `pip install -r requirements.txt` |
   | Start Command | `uvicorn server:app --host 0.0.0.0 --port $PORT --proxy-headers --forwarded-allow-ips="*"` |
   | Health Check Path | `/api/health` |
   | Instance Type | Free |

   The `--proxy-headers --forwarded-allow-ips="*"` flags are **required**:
   Render terminates TLS at its proxy, and without them every request would
   appear to come from the proxy's IP — the per-IP rate limiter would
   throttle all visitors as one user. (`server.py` also reads
   `X-Forwarded-For` directly as a belt-and-braces fallback.)

3. Environment variables:

   | Key | Value |
   |---|---|
   | `MONGO_URL` | the Atlas string from Step 1 (with real password) |
   | `DB_NAME` | `kedbyte` |
   | `CORS_ORIGINS` | `https://kedbyte.com,https://www.kedbyte.com` |
   | `RESEND_API_KEY` | *(leave empty for now — filled in Step 4)* |
   | `SENDER_EMAIL` | *(filled in Step 4 after domain verification)* |
   | `CONTACT_RECIPIENT_EMAIL` | the inbox that should receive enquiries |
   | `ADMIN_TOKEN` | **DECISION** — set a long random string to enable `GET /api/contacts` (send it as an `x-admin-token` header); leave unset and the endpoint stays disabled (404) |

   Do **not** set `E2E_BYPASS_TOKEN` in production — it is the local test
   suite's rate-limit bypass.

4. Deploy, then verify:

   ```
   curl https://kedbyte-api.onrender.com/api/health   → {"status":"ok"}
   ```

5. **Custom domain:** Render service → Settings → Custom Domains → add
   `api.kedbyte.com`. Render shows the CNAME target — note it for Step 3.

   > Free-tier note: the service spins down after ~15 min idle; the first
   > request after that takes ~30–60 s. Acceptable for a contact form —
   > the frontend shows its sending state until the response arrives.

## Step 3 — DNS (Hostinger hPanel → Domains → kedbyte.com → DNS Zone)

First confirm the existing state: apex (`@`) and `www` should already point
at this Hostinger plan (A record to Hostinger's server / default CNAME). If
the site was just added to the plan they are created automatically — leave
them as they are.

Records to add:

| Type | Name | Target / Value | TTL | Purpose |
|---|---|---|---|---|
| CNAME | `api` | *(the target Render showed in Step 2.5, e.g. `kedbyte-api.onrender.com`)* | 14400 | backend under api.kedbyte.com |
| TXT | *(as given by Resend)* | *(as given by Resend)* | 14400 | Resend domain verification (DKIM/SPF) — values come from Step 4 |
| MX | *(only if Resend asks — usually `send` subdomain)* | *(as given by Resend)* | 14400 | Resend return-path |

After adding the CNAME, go back to Render → Custom Domains: it should
verify and issue a certificate automatically (minutes to ~1 h depending on
propagation). `https://api.kedbyte.com/api/health` must return
`{"status":"ok"}` before you build/upload the frontend — the production
bundle points at this URL.

**Fallback:** if the custom domain gives trouble, the frontend can be
rebuilt against the free URL instead:
`REACT_APP_BACKEND_URL=https://kedbyte-api.onrender.com yarn build` — then
re-zip and re-upload (Step 5). Everything else is unchanged.

## Step 4 — Resend

1. https://resend.com → **Domains → Add Domain** → `kedbyte.com`.
2. Resend displays 2–3 DNS records (DKIM TXT, SPF TXT, sometimes an MX on a
   `send.` subdomain). Add each in the Hostinger DNS zone (Step 3 table),
   then hit **Verify** in Resend. Propagation can take up to an hour.
3. **API Keys → Create API Key** (sending access is enough). Copy the
   `re_...` value once — it is only shown once.
4. Back in Render → Environment:
   - `RESEND_API_KEY` = the `re_...` key
   - `SENDER_EMAIL` = an address on the verified domain, e.g.
     `hello@kedbyte.com` (the mailbox does not need to exist; it is the
     From: header). Until the domain verifies you can leave the default
     `onboarding@resend.dev`, which only delivers to your own Resend
     account email.
   - Save → Render redeploys automatically.

## Step 5 — Hostinger (frontend upload)

The deploy artifact is **`kedbyte-frontend-deploy.zip`** at the repo root —
it contains the *contents* of `frontend/build/` (index.html at the top
level), so it extracts straight into `public_html`.

If you need to rebuild it first:

```bash
cd frontend
REACT_APP_BACKEND_URL=https://api.kedbyte.com yarn build
cd build && zip -r ../../kedbyte-frontend-deploy.zip . -x ".DS_Store" -x "*/.DS_Store"
```

Upload:

1. hPanel → **Files → File Manager** → `public_html`.
2. Delete Hostinger's default placeholder files (`default.php`,
   `index.php`, etc.) — `public_html` should be empty.
3. Upload `kedbyte-frontend-deploy.zip` → right-click → **Extract** into
   `public_html` → delete the zip afterwards.
4. Verify `.htaccess` is present at `public_html/.htaccess` and
   `public_html/static/.htaccess` (File Manager hides dotfiles unless
   "Show hidden files" is enabled — turn it on).

## Step 6 — SSL

1. hPanel → **Security → SSL** → confirm the free Lifetime SSL is
   **Active** for kedbyte.com (install it if not — one click).
2. Test: `http://kedbyte.com` must 301 to `https://kedbyte.com` (that
   redirect ships in the `.htaccess`). Hostinger also has a "Force HTTPS"
   toggle — fine to enable too; the rules don't conflict.

## Step 7 — Post-deploy verification

1. **Routes / SPA rewrite:** type each URL directly into the browser bar
   (not via in-app nav — this proves the Apache fallback):
   `/`, `/services`, `/payroll`, `/about`, `/careers`, `/contact`, and a
   junk path like `/definitely-missing` (should render the 404 page, not an
   Apache error). All over `https://kedbyte.com`.
2. **Console:** DevTools open while clicking through all routes — zero
   errors expected.
3. **Contact form end-to-end:** submit a real test enquiry on `/contact`.
   Expect: success state in UI → document in Atlas (Collections →
   `kedbyte.contacts`) → email in `CONTACT_RECIPIENT_EMAIL`'s inbox.
   *(First submission after idle may take ~30–60 s — Render free tier
   cold start.)*
4. **Payroll lead tagging:** open `/payroll` → "Get early access" → submit.
   The new Atlas doc must have `"source": "payroll-early-access"`.
5. **Rate limit:** submit the form 6× rapidly (or curl a burst) — the 6th
   must return HTTP 429 and the UI its "too many requests" toast.
6. **Lighthouse spot-check** on `https://kedbyte.com` (Chrome DevTools →
   Lighthouse). Expect roughly the audited numbers (Perf 90+ desktop /
   ~75 mobile, 100 A11y/BP/SEO). Verify `/static/js/...` responds with
   `cache-control: public, max-age=31536000, immutable` and `/index.html`
   with `no-cache` (Network tab).
7. **OG check:** paste `https://kedbyte.com` into
   https://www.opengraph.xyz or a WhatsApp/Slack message — title,
   description and the og-image card should render.

---

## Ongoing deploys

- **Backend:** `git push` → Render auto-deploys `backend/`.
- **Frontend:** rebuild + re-zip (Step 5 commands) → upload + extract into
  `public_html` again. Old hashed bundles can be left or cleaned; new
  `index.html` takes effect immediately thanks to `no-cache`.
