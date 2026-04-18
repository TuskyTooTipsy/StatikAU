# STATIK Master Corrective Upgrade v3

This pass updates the existing STATIK project only. It does not replace the repo with a template and it preserves the current events, profiles, garage, QR/share, uploads, communities, friends, shop lock, imports, and admin foundations.

## Current repo audit summary

The repo already had a partially upgraded event-first STATIK build with React/Vite/Tailwind/Framer Motion frontend, Express/TypeScript backend, file-backed runtime persistence, local signed-upload storage, admin pages, event imports, QR/share links, a backend vehicle registry, community/group foundations, analytics, and garage dossiers.

The main remaining gaps found were:

- no real public Articles or News system
- no admin CMS for Articles/News
- no admin AI draft writer
- no real Business Directory
- signup/onboarding was still too basic
- newest members was missing as a real discovery feature
- admin had many pages, but not enough command-center coverage for content/business/AI/QR
- media records had weak public metadata and public UI could still expose raw filenames
- content/business upload ownership targets were not supported
- public search did not include articles/news/businesses/newest member discovery
- statik.au canonical sharing had to remain enforced across new content types

## Driver Nation feature inspiration translated into STATIK

Driver Nation was used for product feature inspiration only: member discovery, members' rides, clubs/groups, events, business directory, reviews/deals/jobs/community depth, and category/location search. STATIK keeps its own dark, sharper, event-led, premium automotive culture direction and does not copy Driver Nation's visual style.

## Features added

### Newest Members

- Added backend discovery endpoint: `/api/profiles/discovery/newest`
- Added profile fields for member type, interest tags, preferred event types, discovery visibility, newest member visibility, completion state, and privacy controls.
- Added homepage newest members module using real opted-in profiles only.
- Added member discovery route: `/members/discovery`
- Added member discovery search/filter UI.
- Banned/suspended/hidden users are excluded.
- Admin settings can enable/disable newest member discovery and require profile completion.

### Signup / onboarding

- Rebuilt Join into a four-step onboarding flow:
  1. account basics
  2. optional member details
  3. optional first garage vehicle
  4. next action
- Added username/handle, terms acceptance state, location, member type, short bio, interest tags, preferred events, discovery/privacy choices, avatar upload, optional first garage vehicle.
- Optional steps remain skippable.
- First account bootstrap/admin behavior is preserved.

### Articles + News

Public routes added:

- `/articles`
- `/articles/:slug`
- `/news`
- `/news/:slug`

Backend added:

- `/api/content/articles`
- `/api/content/articles/:slug`
- `/api/content/news`
- `/api/content/news/:slug`

Content supports:

- article/news type
- slug
- title/excerpt/body
- hero/gallery media
- category/tags
- draft/pending/published/scheduled/archived status
- featured/sponsored flags
- related events/businesses/profiles/communities
- SEO fields
- AI-assisted flag
- revision history
- statik.au canonical share URL
- statik.au short link / QR support

Public pages show published content only. No fake posts are seeded.

### Admin CMS

Admin routes added:

- `/admin/articles`
- `/admin/news`

Admin API added:

- `GET /api/admin/content`
- `POST /api/admin/content`
- `PATCH /api/admin/content/:contentId`
- `DELETE /api/admin/content/:contentId`

CMS supports:

- create/edit drafts
- publish/schedule/archive states
- feature/sponsor flags
- categories/tags
- SEO title/description
- hero/gallery uploads after draft save
- revision snapshots before edits
- approval bay inclusion for pending/scheduled content

### Admin AI Writer

Admin route added:

- `/admin/ai-writer`

Backend endpoint added:

- `POST /api/admin/ai-writer/generate`

AI Writer supports draft-generation modes for article/news/editorial workflows and logs every generation. It never auto-publishes. If AI is not configured, the UI and API fail safely and manual CMS remains usable.

Safety rule in the backend prompt: AI must not invent real events, people, quotes, results, stats, sponsorships, or attendance. If facts are missing, it must mark gaps or generate questions.

### Business Directory

Public routes added:

- `/businesses`
- `/businesses/:slug`

Backend routes added:

- `GET /api/businesses`
- `GET /api/businesses/:slug`
- `POST /api/businesses/submit`

Admin route added:

- `/admin/businesses`

Admin API added:

- `GET /api/admin/businesses`
- `POST /api/admin/businesses`
- `PATCH /api/admin/businesses/:businessId`
- `DELETE /api/admin/businesses/:businessId`

Directory supports:

- pending/approved/rejected/suspended/archived status
- trusted/sponsored/featured flags
- category/subcategory/service/specialty fields
- region/address/contact/socials
- logo/banner/gallery media
- owner relationship
- linked events/articles/news/communities
- approval bay inclusion
- statik.au short link / QR support

Public business submissions require auth and remain pending until admin approval.

### Media metadata / filename cleanup

Media model now supports:

- originalFilename
- displayTitle
- caption
- altText
- thumbnailUrl
- width/height/duration fields for future processing

Added:

- `PATCH /api/media/assets/:assetId`
- owner/admin metadata permission checks
- content/business upload target support
- content/business media reference cleanup on deletion
- user garage media metadata edit controls
- admin media metadata edit controls

Public components now prefer preview/title/caption/alt text and avoid exposing raw filenames by default. Original filenames remain available in admin media moderation.

### Admin master control board expansion

Admin navigation now includes:

- Overview
- Approval Bay
- Events
- Event Imports
- Members / Users
- Garage / Vehicles
- Communities / Groups
- Posts
- Articles
- News
- AI Writer
- Business Directory
- Sponsors / Deals
- Media Library
- Messages
- Reports
- QR / Short Links
- Analytics
- Roles
- Shop
- Settings
- Audit Logs

New admin pages added:

- Articles CMS
- News CMS
- AI Writer
- Business Directory
- QR / Short Links

Approval Bay now includes:

- event submissions
- event imports
- reports
- posts
- pending/scheduled articles/news
- pending businesses

Settings now includes controls and warnings for:

- newest members
- profile completion requirement
- articles
- news
- business directory
- AI writer
- AI provider configuration
- canonical public app URL
- backend/API URL
- storage
- upload limit
- map provider
- imports
- moderation
- shop lock

### Search/discovery

Global backend search now includes real public/approved:

- events
- discoverable profiles
- public communities
- published articles/news
- approved businesses

## Existing systems preserved

- events and event import foundations
- Queensland Raceway import adapter/fallback architecture
- garage/build dossier registry
- backend vehicle registry API
- QR/share using statik.au
- uploads and media route
- communities/groups/friends
- analytics pages
- shop lock behavior
- admin users/events/imports/messages/media/garage/settings/audit pages
- Netlify/Railway deployment structure

## Queensland Raceway import status

The existing adapter-based import system is preserved. It still attempts Queensland Raceway calendar/source routes first and stages records for admin review. Fallback sources remain adapter-based and do not auto-publish.

No fake import records were inserted.

## Env vars

Backend / Railway:

```bash
NODE_ENV=production
PUBLIC_APP_URL=https://statik.au
FRONTEND_URL=https://statik.au
ALLOWED_ORIGINS=https://statik.au,https://www.statik.au
PUBLIC_SERVER_URL=https://YOUR-RAILWAY-BACKEND-DOMAIN
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_DISPLAY_NAME=
JWT_SECRET=
MAX_UPLOAD_BYTES=41943040
UPLOADS_DIR=/data/uploads
STORAGE_PROVIDER=local
STORAGE_BUCKET=
STORAGE_REGION=
STORAGE_PUBLIC_URL=
STORAGE_ACCESS_KEY_ID=
STORAGE_SECRET_ACCESS_KEY=
AI_PROVIDER=openai
AI_API_KEY=
AI_MODEL=gpt-4o-mini
AI_DEFAULT_TONE=sharp, premium, automotive editorial
AI_MAX_TOKENS=1200
GOOGLE_MAPS_API_KEY=
MAPBOX_TOKEN=
```

Frontend / Netlify:

```bash
VITE_API_BASE_URL=https://YOUR-RAILWAY-BACKEND-DOMAIN
VITE_PUBLIC_APP_URL=https://statik.au
VITE_GOOGLE_MAPS_API_KEY=
VITE_MAPBOX_TOKEN=
```

## Netlify setup

- Base directory: `statik-frontend`
- Build command: `npm ci --include=dev --no-audit --no-fund && npm run build`
- Publish directory: `statik-frontend/dist`
- SPA redirects must keep `/s/:slug` on the frontend so it can call backend tracking and redirect cleanly.
- Set `VITE_PUBLIC_APP_URL=https://statik.au`.
- Set `VITE_API_BASE_URL` to the Railway backend URL.
- Set `VITE_GOOGLE_MAPS_API_KEY` for Google Places/map behavior.

## Railway setup

- Root directory: `statik-backend`
- Build command: `npm ci --include=dev --no-audit --no-fund && npm run build`
- Start command: `npm run start`
- Healthcheck: `/api/health`
- Set `PUBLIC_APP_URL=https://statik.au` for public share/QR links.
- Set `PUBLIC_SERVER_URL` to the Railway backend domain for upload/API URLs.
- If using local uploads, mount a Railway volume at `/data` and set `UPLOADS_DIR=/data/uploads`.

## Storage/upload notes

Uploads are still local-volume compatible by default. They are owner-scoped and use signed upload URLs. For production durability, configure a Railway persistent volume or replace the storage layer with S3/R2 using the storage env shape already present.

Object storage is still the premium production path.

## Build/test results in this container

- Backend targeted TypeScript syntax checks passed for modified backend files.
- Frontend targeted TypeScript/JSX syntax checks passed for modified frontend files.
- Direct esbuild browser bundle of `src/main.tsx` passed.
- Full Vite build started and reached `transforming...`, but did not complete reliably in this container after dependency install. One syntax error found in Admin Media was fixed, then Vite still did not finish here. Run Netlify build under the configured Node 20 environment before deploy.
- Full backend `npm run build` could not be fully verified here because backend dependencies were not reliably installed in this container. Railway should run the normal dependency install and build.

## Remaining production risks

- File-backed runtime DB is still not an enterprise database. Postgres/Prisma remains the durable next step.
- Local uploads require Railway volume persistence. Without a volume, uploads can disappear across rebuild/redeploy.
- AI Writer depends on a configured server-side AI provider key.
- Google Maps requires a valid frontend key and billing/configuration.
- Queensland Raceway/live external imports need final smoke testing on Railway where outbound HTTPS is reliable.
- No fake content was seeded; public Articles/News/Business pages will show truthful empty states until real approved content exists.
