# Architecture

## 1. Overview

```
Browser ──HTTPS──► CDN / nginx ──► static SPA (React)            (public site + /admin)
                        │
                        └─/api──► FastAPI (uvicorn, stateless) ──► PostgreSQL 16
                                        │                          (primary + daily backups / PITR)
                                        ├──► Payment gateway (Razorpay-style: orders, checkout, webhooks, refunds)
                                        ├──► Object storage (S3 / R2 / Spaces) via presigned uploads
                                        └──► Transactional email (SES / SendGrid / SMTP)
```

* The frontend is a static bundle. Every page component calls the **service layer** (`src/services/api.ts`), never `fetch` directly. With `VITE_API_BASE_URL` empty it resolves demo data; set it to `/` (same origin) or the API URL to go live.
* The API is stateless; sessions are signed JWTs in httpOnly cookies, so it scales horizontally.

## 2. Frontend structure

```
src/
  config/        brand.ts (single rebrand point), navigation.ts
  data/          demo data (clearly labelled)
  types/         shared TypeScript types (mirror backend schemas)
  services/      api.ts (REST + mock), payment.ts (gateway adapter)
  hooks/         useAsync (loading/success/error), useForm (validation), useSeo, useInView, useCountUp
  utils/         format (₹ en-IN grouping, dates), validate (Indian phone, PAN, PIN), csv, storage
  components/
    ui/          Button, Badge, Alert, Modal, Toast, Field, ProgressBar, States, Controls, Section
    layout/      Navbar, Footer, AnnouncementBar, PageHero, PublicLayout, Logo
    cards/       ProgrammeCard, CampaignCard, StoryCard, EventCard, ImpactStat, AnimalCard
    forms/       DonationForm, VolunteerForm, PartnershipForm, ContactForm, NewsletterForm, QuickForms, DemoGatewaySheet
    charts/      ColumnChart, BarList, Sparkline (dependency-free SVG, with screen-reader tables)
    media/       Scene (illustration system), Media (real image or illustration), Icon
  pages/public/  Home, About, Programmes(+detail), Campaigns(+detail), Donate(+status), Impact,
                 Content (Stories, Events, Gallery), Involve (Volunteer, Fundraise, CSR, Campus, Careers), Info (Contact, FAQ, Transparency, Legal)
  admin/         auth (RequireAuth), permissions, store, DataTable, ResourceManager, AdminLayout, pages/*
```

Routes are lazy-loaded per page group; the admin bundle loads only under `/admin`.

## 3. Routes

Public: `/`, `/about`, `/programmes`, `/programmes/:slug` (11 programmes), `/campaigns`, `/campaigns/:slug`, `/donate`, `/donate/status/:id`, `/impact`, `/stories`, `/stories/:slug`, `/events`, `/events/:slug`, `/gallery`, `/get-involved`, `/volunteer`, `/fundraise`, `/csr`, `/get-involved/campus`, `/careers`, `/contact`, `/faq`, `/transparency`, `/legal/{privacy|terms|donation-refund|safeguarding}`, 404.

Admin (protected, redirects to `/admin/login`): dashboard, donations, campaigns, programmes, volunteers, stories, events, gallery, animals, impact, csr, messages, reports, documents, users, settings.

## 4. API contract

JSON uses camelCase. Validation errors return `422 {detail:[{loc, msg}]}` and are mapped to form fields.

### Public
| Method | Path | Notes |
|---|---|---|
| GET | `/api/programmes`, `/api/programmes/{slug}` | Published only |
| GET | `/api/campaigns?category=&include_closed=` · `/api/campaigns/{slug}` | Raised/supporters derived from successful donations |
| GET | `/api/stories?category=&kind=&page=` · `/api/stories/{slug}` | Published or scheduled-and-due |
| GET | `/api/events?when=upcoming\|past` · `/api/events/{slug}` | |
| GET | `/api/gallery/albums?programme=` | Published albums |
| GET | `/api/animals/listings?status=` | General area only; never exact location |
| GET | `/api/impact?year=&programme=&location=` | **Verified metrics only** |
| GET | `/api/documents` | Download URL only when verified |
| GET | `/api/faqs`, `/api/updates` | |

### Forms (rate-limited 5/min/IP)
`POST /api/volunteers`, `/api/partnerships`, `/api/contact` (honeypot `website`), `/api/newsletter` (double opt-in), `/api/animals/interest`, `/api/events/{id}/register`, `/api/fundraisers/interest` → `201 {ok, reference}`.

### Donations
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/donations/create-order` | Validates, fixes amount server-side, creates donor + donation + gateway order. Returns `{donationId, reference, gatewayOrderId, amount, currency, publicKey}` |
| POST | `/api/donations/{id}/verify` | Checks checkout signature → `pending` |
| POST | `/api/donations/{id}/cancel` | Donor closed checkout |
| POST | `/api/donations/webhook` | Gateway-signed; **authoritative** status; idempotent |
| GET | `/api/donations/{id}/status` | Polled by the status page |

### Admin (cookie session + permission per route)
`POST /api/admin/login | refresh | logout`, `GET /api/admin/me`, `GET /api/admin/dashboard`,
`GET /api/admin/donations` (filters: status, campaign_id, date_from, date_to, min_amount), `GET /api/admin/donations/export.csv`, `POST /api/admin/donations/{id}/refund`,
CRUD `GET/POST /api/admin/{resource}`, `GET/PATCH/DELETE /api/admin/{resource}/{id}` for `programmes, campaigns, stories, events, gallery, animals, animal-cases, impact-metrics, documents, volunteers, partnerships, messages`,
`GET/POST /api/admin/users`, `POST /api/admin/users/{id}/revoke-sessions`, `POST /api/admin/uploads/sign`.

Interactive docs at `/api/docs` in non-production environments.

## 5. Database

PostgreSQL schema in `backend/db/schema.sql` (generated from `app/models`); use Alembic for migrations. 22 tables:

`users`, `audit_logs`, `programmes`, `campaigns`, `stories`, `events`, `event_registrations`, `gallery_albums`, `gallery_media`, `impact_metrics`, `documents`, `donors`, `donations`, `payment_events`, `volunteers`, `partnerships`, `contact_messages`, `newsletter_subscribers`, `animal_cases`, `animal_listings`, `animal_interests`, `site_settings`.

Key relationships: `campaigns.programme_id → programmes`, `donations.donor_id → donors`, `donations.campaign_id → campaigns`, `payment_events.donation_id → donations`, `gallery_media.album_id → gallery_albums (cascade)`, `impact_metrics.source_document_id → documents`, `animal_listings.case_id → animal_cases`, `audit_logs.actor_id → users`.
Indexes cover slugs, statuses, dates, gateway ids (unique), and `(status, paid_at)` for reporting. Money is whole rupees in `BIGINT`.

## 6. Authentication & roles

* Passwords: Argon2id, rehash on login when parameters change. Lockout after 5 failures for 15 minutes; login rate-limited.
* Sessions: short-lived access JWT + rotating refresh JWT in `httpOnly; Secure; SameSite=Strict` cookies scoped to `/api`. `token_version` revokes all sessions for a user. Optional TOTP 2FA (`mfa_secret`).
* RBAC: permissions in `backend/app/auth/permissions.py`, mirrored in `frontend/src/admin/permissions.ts` (UI only hides; the server enforces).

| Role | Can |
|---|---|
| Super Admin | Everything, including users, settings and audit log |
| Admin | All content, volunteers, CSR, messages, reports, donations (read/export) |
| Finance | Donations (read/export/refund), CSR, reports, documents |
| Content Manager | Campaigns, programmes, stories (publish), events, gallery, animals, impact |
| Volunteer Coordinator | Volunteers, events, animals, messages |

## 7. Payments (India: UPI, cards, net banking)

1. Donor completes the form. Browser calls `create-order`; **the server sets the amount** and creates a gateway order with the secret key.
2. Browser opens the gateway's hosted checkout with only the order id and **public** key. Card, UPI and bank details go straight to the gateway (PCI-DSS scope stays with the gateway). Nothing sensitive touches our servers or database.
3. On success the checkout returns `{order_id, payment_id, signature}`; `/verify` checks `HMAC_SHA256(order_id|payment_id, key_secret)` → `pending`.
4. The gateway sends `payment.captured` / `payment.failed` / `refund.processed` webhooks. The API verifies `X-Razorpay-Signature = HMAC_SHA256(raw_body, webhook_secret)` with a constant-time compare, stores the event id for idempotency, checks the amount matches, then marks `success`, issues a receipt number, recomputes campaign totals and emails a confirmation.
5. Monthly giving: gateway subscriptions / UPI AutoPay mandates (`create_subscription`); `gateway_subscription_id` links recurring charges.
6. Status page handles success, pending (polls), failed, cancelled and refunded.

Swapping gateways means replacing `backend/app/services/payment_gateway.py` and `frontend/src/services/payment.ts`; the UI and data model do not change.

Tax receipts: collect PAN + address only when requested; generate receipts and Form 10BD data from verified `donations` rows. **Confirm 80G/12A status and receipt format with the NGO's CA before enabling.**

## 8. Security checklist

- [x] HTTPS everywhere; HSTS preload header
- [x] Argon2id password hashing; lockout; rate limiting (slowapi) on login, forms, payment endpoints
- [x] httpOnly/Secure/SameSite=Strict cookies (CSRF mitigation); CORS restricted to known origins with credentials
- [x] Pydantic validation on every input; field allow-list on admin CRUD; honeypot on contact
- [x] Security headers: CSP, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy; `no-store` on admin API
- [x] Webhook signature verification, idempotency, amount check; secrets only in environment variables
- [x] Audit log for sign-ins, CRUD, exports, refunds (append-only for the app DB role)
- [x] CSV formula-injection guard on exports
- [x] Private storage for consent forms / unverified documents, served via short-lived signed URLs
- [x] Public APIs never expose exact animal locations, donor emails, PAN, or unverified metrics
- [ ] Operational: nightly `pg_dump` + WAL/PITR (managed Postgres), restore drill quarterly; encrypt PAN at rest (pgcrypto or KMS); dependency scanning; error tracking (Sentry) without PII

## 9. SEO

* Clean URLs (`/programmes/animal-welfare`, `/campaigns/education-kits`, `/stories/{slug}`).
* `useSeo` sets title, description, canonical, Open Graph, Twitter and JSON-LD (`NGO`, `Service`, `DonateAction`, `Article`, `Event`).
* `public/robots.txt` (disallows `/admin`, donation status pages), `npm run sitemap` → `public/sitemap.xml`.
* For best indexing, prerender public routes at build time (e.g. `vite-plugin-prerender` / `react-snap`) or serve via SSR; the content is already route-addressable.

## 10. Performance

Route-level code splitting (admin separate), vendor chunk, immutable hashed assets, gzip, font `display=swap` with preconnect, lazy images with `decoding="async"`, SVG illustrations (no image weight), CSS-only scroll animations with reduced-motion support, CDN caching headers on public API responses.

## 11. Accessibility

Semantic landmarks and headings, skip link, visible focus ring, labelled form controls with `aria-invalid`/`aria-describedby` errors, focus moved to the first invalid field, accessible modal (focus trap, Escape, focus return), keyboard-operable menus and filters, `aria-current`, progress bars with values, charts with hidden data tables, and colour tokens checked for contrast in light and dark themes.

## 12. Responsive QA

Verified with no horizontal overflow at 390, 768, 1024, 1280 and 1440px. Mobile gets a sticky donate bar after scrolling and a single-column, large-target donation flow.

## 13. Privacy & safeguarding in the product

* Stories carry a consent state (`recorded` / `anonymised`) shown on every card; child-protection and marriage-assistance content is never identifying.
* Animal listings show a general area only.
* Only verified documents and metrics are published; placeholders are labelled `[Replace with verified …]`.
