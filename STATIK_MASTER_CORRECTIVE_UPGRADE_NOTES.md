# STATIK Master Corrective Upgrade Notes

## Audit summary

This pass was made against the existing partially upgraded STATIK repo. The upgrade preserved the current React/Vite/Tailwind/Framer frontend, Express/TypeScript backend, auth, profiles, communities, friends, events, garage, QR/share, analytics, admin and shop-lock systems.

Problems found in the previous build:

- The Build Dossier registry was still not deep enough and was too dependent on frontend data.
- The frontend vehicle registry dataset had grown heavy enough to slow/hang TypeScript/Vite transforms in this environment.
- Queensland Raceway import logic existed, but needed a clearer adapter/fallback architecture and source-health flow.
- The map field was Mapbox-only; the user requested Google Maps or equivalent and working map behavior.
- Admin navigation was missing dedicated central approval, message moderation, media moderation and garage oversight surfaces.
- Settings still described Mapbox as the primary provider even after Google Maps became the better target.
- The admin overview did not expose vehicles/short links to command-center pages.
- Type definitions around profile/community post media were inconsistent.

## What was kept

- Existing project structure.
- Existing backend JSON persistence model.
- Existing Railway + Netlify deployment direction.
- Existing profile/community/friends/events/admin/shop-lock foundations.
- Existing QR/shortlink tracking model.
- Existing local signed-upload flow, now with clearer production requirements.

## What was fixed / added

### Canonical QR/share URLs

- `PUBLIC_APP_URL` remains the canonical public app domain.
- Public short links and QR links use `https://statik.au/s/{slug}` and `https://statik.au/s/{slug}?src=qr`.
- `PUBLIC_SERVER_URL` remains backend/API/upload only.
- Smoke test confirmed `/api/links/me` returns `https://statik.au/s/statik-admin` in the local test configuration.

### Uploads

- Existing signed binary upload flow is preserved.
- MIME inference supports common mobile/image/video types including HEIC/HEIF.
- Upload ownership checks remain enforced by target type: profile, vehicle, event, community, community_post, profile_post.
- Smoke test confirmed profile image upload init + signed PUT completed successfully locally.
- Production still requires persistent Railway volume or object storage.

### Build Dossier registry

- Backend now owns the large structured registry.
- Added backend endpoints:
  - `GET /api/vehicle-registry`
  - `GET /api/vehicle-registry/makes?type=car`
  - `GET /api/vehicle-registry/models?make=Ford&type=car`
  - `GET /api/vehicle-registry/generations?make=Ford&model=Falcon`
  - `GET /api/vehicle-registry/trims?make=Ford&model=Falcon`
  - `GET /api/vehicle-registry/variants?make=Ford&model=Falcon`
  - `GET /api/vehicle-registry/search?q=skyline`
  - `POST /api/vehicle-registry/custom-suggestion`
- Frontend My Garage uses backend registry data and keeps only a lightweight fallback so production builds remain fast.
- Vehicle coverage smoke count from compiled backend:
  - 90 car makes
  - 23 motorcycle makes
  - 28 truck/4x4/commercial makes
  - 664 models
  - 6,896 generation/trim/special-edition/variant suggestions

### Google Maps location field

- The existing `MapboxLocationField` component name is preserved for compatibility, but it now uses Google Maps Places + Geocoder when `VITE_GOOGLE_MAPS_API_KEY` is configured.
- Behavior:
  - typed suggestions via Places autocomplete
  - selectable place result
  - square interactive map preview
  - draggable marker
  - click-to-move marker
  - reverse geocode after pin move
  - manual fallback when token is missing

### Event imports

- Import architecture now uses source adapters.
- Queensland Raceway adapter tries the direct calendar path first.
- If direct calendar records cannot be consumed, it falls back to venue-relevant sources:
  - RacingCalendar Queensland Raceway page
  - The Drive Team events page
  - The Drive Team Queensland Raceway location page
- Additional configured sources:
  - Willowbank Raceway events
  - RacingCalendar Queensland Raceway
  - The Drive Team events
- Everything external stages in admin import items first. Nothing auto-publishes.
- Import records keep source URL/source name/raw parsed text/status/admin note/duplicate info.

### Admin master control board

Added dedicated admin command surfaces:

- `/admin/approvals` — central Approval Bay for pending events/imports/reports/posts.
- `/admin/messages` — admin-only message moderation search with hide/delete/restore actions.
- `/admin/media` — media/upload moderation surface.
- `/admin/garage` — garage/vehicle registry oversight.

Updated admin nav to include:

- Approval Bay
- Messages
- Media
- Garage / Vehicles

Updated settings to show Google Maps as the primary map provider and runtime diagnostics for canonical app/API/storage/map health.

## Env vars

### Railway backend

Required:

```bash
PUBLIC_APP_URL=https://statik.au
FRONTEND_URL=https://statik.au
ALLOWED_ORIGINS=https://statik.au,https://www.statik.au
PUBLIC_SERVER_URL=https://YOUR-RAILWAY-BACKEND-DOMAIN
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=strong-password
ADMIN_DISPLAY_NAME=STATIK Admin
JWT_SECRET=at-least-16-characters
MAX_UPLOAD_BYTES=41943040
GOOGLE_MAPS_API_KEY=your-google-maps-key-if-used
```

Local upload mode:

```bash
STORAGE_PROVIDER=local
UPLOADS_DIR=/data/uploads
DATA_DIR=/data
```

Object-storage future adapter vars are reserved:

```bash
STORAGE_PROVIDER=s3
STORAGE_BUCKET=
STORAGE_REGION=
STORAGE_PUBLIC_URL=
STORAGE_ACCESS_KEY_ID=
STORAGE_SECRET_ACCESS_KEY=
```

### Netlify frontend

```bash
VITE_PUBLIC_APP_URL=https://statik.au
VITE_API_BASE_URL=https://YOUR-RAILWAY-BACKEND-DOMAIN
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-browser-key
```

## Railway backend setup

- Root directory: `statik-backend`
- Build command: `npm ci --include=dev --no-audit --no-fund && npm run build`
- Start command: `npm run start`
- Healthcheck: `/api/health`
- If keeping local uploads/JSON store, mount a Railway volume and set `DATA_DIR=/data` and `UPLOADS_DIR=/data/uploads`.

## Netlify frontend setup

- Base directory: `statik-frontend`
- Build command: `npm ci --include=dev --no-audit --no-fund && npm run build`
- Publish directory: `statik-frontend/dist`
- SPA redirect must preserve frontend routes including `/s/:slug`.

## statik.au QR/share routing

- Frontend route `/s/:slug` resolves the slug through the backend API.
- Backend tracks `shortlink_click` or `qr_scan` depending on `src=qr`.
- Public URLs shown to users must come from `PUBLIC_APP_URL` / `VITE_PUBLIC_APP_URL`, not backend origin.

## Build/test results

- Backend TypeScript build completed after dependency install. No TypeScript errors reported.
- Frontend `tsc --noEmit` passed after type fixes.
- Frontend `npm run build` completed successfully with Vite: 474 modules transformed, production bundle generated.
- Backend smoke tests performed locally:
  - `/api/health` returned OK.
  - `/api/vehicle-registry/makes?type=car` returned backend registry payload with 142 total makes.
  - `/api/links/me` returned canonical `https://statik.au/s/...` URLs.
  - profile upload init + signed binary PUT succeeded.
- Live import smoke was limited by this container's Node fetch/network behavior. The code now includes direct Queensland Raceway first, adapter fallbacks, source URLs, staging and admin review/publish flow. Verify live import on Railway where outbound HTTPS is available.

## Remaining production risks

- Local upload storage requires Railway persistent volume. Without a volume, uploads can disappear after deploy/restart.
- S3/R2 adapter is still the enterprise-grade storage next step.
- The backend is still JSON/file-backed; Postgres/Prisma remains the enterprise-grade persistence step.
- Imported external pages can change structure. The adapter/source-health model is built for breakage detection and admin fallback rather than silent failure.
