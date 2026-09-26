# Shivshristi Seva Sansthan — NGO Platform

A full-stack platform for an NGO working with people, animals and communities: public website, donations, volunteering, campaigns, impact reporting, and a role-based admin console.

> **"Shivshristi Seva Sansthan" is a placeholder brand.** All statistics, campaigns, stories, people and documents are clearly labelled demo content. Replace them with verified data before launch.

## What's inside

```
frontend/   React 18 + Vite + TypeScript + Tailwind CSS (public site + /admin)
backend/    FastAPI + SQLAlchemy 2 + PostgreSQL (REST API, auth, payments, webhooks)
docs/       Architecture, API contract, security, payments, SEO, deployment
docker-compose.yml   PostgreSQL + API + static frontend for local full-stack runs
```

## Quick start

**Frontend only (demo data, no server needed)**

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

With `VITE_API_BASE_URL` empty, the UI runs on built-in demo data. Forms validate and show success/error states, the donation flow opens a clearly labelled **demo payment gateway** (choose success / pending / failed / cancelled), and `/admin` accepts the demo accounts shown on the login page (password `demo1234`). Nothing is sent or persisted.

Tip: type `simulate-error` into any form field to preview the error state.

**Full stack**

```bash
cp backend/.env.example backend/.env      # fill in secrets
docker compose up --build                 # web on http://localhost:8080
docker compose exec api alembic revision --autogenerate -m "init" && docker compose exec api alembic upgrade head
docker compose exec api python -m app.seed --email you@yourngo.org --name "Your Name"
```

**Backend tests**

```bash
cd backend && pip install -r requirements.txt && pytest
```

Tests cover field-level validation, the signed payment flow (valid/forged webhook, idempotency, amount mismatch) and RBAC (401/403 by role).

## Rebranding

Edit `frontend/src/config/brand.ts` (name, tagline, contact details, social links, legal placeholders, announcement / emergency bar). Colours live as tokens in `frontend/src/index.css`; the logo mark is `frontend/src/components/layout/Logo.tsx`.

## Replacing demo content

| What | Where (demo) | Where (live) |
|---|---|---|
| Programmes, campaigns, stories, events, animals, gallery | `frontend/src/data/*.ts` | Admin console → API → PostgreSQL |
| Impact figures | `frontend/src/data/impact.ts` (generated sample) | `impact_metrics` with `is_verified = true` only |
| Documents / reports | `frontend/src/data/content.ts` (`verified: false`) | Admin → Documents (upload PDF, mark verified) |
| Registration, PAN, 80G/12A, CSR-1, FCRA | `brand.legal` placeholders | Verified values only |
| Legal policy text | `pages/public/Info.tsx` (templates) | Lawyer-approved text |
| Photos | Illustrations (`components/media/Scene.tsx`) | Pass `src` to `<Media>`; consented images only |

See `docs/ARCHITECTURE.md` for the full API contract, database design, payment flow and security model.
