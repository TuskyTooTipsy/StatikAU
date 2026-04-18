# STATIK Deep Corrective Upgrade Notes

This pass was applied on top of the existing partially-upgraded STATIK repo. It preserves the current frontend/backend structure and extends the existing systems instead of replacing the project.

## What was audited

Backend files inspected:
- `statik-backend/src/server.ts`
- `statik-backend/src/lib/env.ts`
- `statik-backend/src/lib/store.ts`
- `statik-backend/src/lib/bootstrap.ts`
- `statik-backend/src/lib/importSources.ts`
- `statik-backend/src/routes/auth.ts`
- `statik-backend/src/routes/media.ts`
- `statik-backend/src/routes/links.ts`
- `statik-backend/src/routes/profiles.ts`
- `statik-backend/src/routes/events.ts`
- `statik-backend/src/routes/submissions.ts`
- `statik-backend/src/routes/admin.ts`
- `statik-backend/src/routes/analytics.ts`
- `statik-backend/src/routes/communities.ts`
- `statik-backend/package.json`
- `statik-backend/railway.json`

Frontend files inspected:
- `statik-frontend/src/App.tsx`
- `statik-frontend/src/api/network.ts`
- `statik-frontend/src/api/uploads.ts`
- `statik-frontend/src/types/network.ts`
- `statik-frontend/src/data/vehicleRegistry.ts`
- `statik-frontend/src/components/platform/MapboxLocationField.tsx`
- `statik-frontend/src/pages/Home.tsx`
- `statik-frontend/src/pages/Events.tsx`
- `statik-frontend/src/pages/EventDetail.tsx`
- `statik-frontend/src/pages/Submit.tsx`
- `statik-frontend/src/pages/account/MyGarage.tsx`
- `statik-frontend/src/pages/account/MyQRCode.tsx`
- `statik-frontend/src/pages/account/MyLinks.tsx`
- `statik-frontend/src/pages/account/MyAnalytics.tsx`
- `statik-frontend/src/pages/account/MyPosts.tsx`
- `statik-frontend/src/pages/members/Communities.tsx`
- `statik-frontend/src/pages/members/CommunityDetail.tsx`
- `statik-frontend/src/pages/admin/Overview.tsx`
- `statik-frontend/src/pages/admin/Events.tsx`
- `statik-frontend/src/pages/admin/Imports.tsx`
- `statik-frontend/src/pages/admin/Users.tsx`
- `statik-frontend/src/pages/admin/AuditLogs.tsx`
- `statik-frontend/src/pages/admin/Settings.tsx`

Deployment/config inspected:
- `netlify.toml`
- `statik-frontend/netlify.toml`
- `railway.json`
- `DEPLOY_NOW.md`
- `DEPLOYMENT_NOTES.txt`

## External research translated into implementation

- Queensland Raceway calendar/events pages are source-adapted as a staged import source, not auto-published.
- Mapbox forward/reverse geocoding and draggable-marker patterns drive the location component/fallback model.
- Australian enthusiast vehicle structure is represented through a versioned vehicle registry API and smart dependent vehicle selectors.

## Kept

- Existing auth/account flows.
- Existing profiles, communities, friends, events, shop/admin foundations.
- Existing dark/angular STATIK visual system.
- Existing Railway backend + Netlify frontend deployment model.
- Existing JSON runtime store architecture, but hardened and extended.

## Fixed

### Canonical share links / QR domain

Public share links now use `PUBLIC_APP_URL`, not `PUBLIC_SERVER_URL`.

User-facing links resolve as:
- `https://statik.au/s/{slug}`
- QR payloads resolve as `https://statik.au/s/{slug}?src=qr`

Backend/API/upload URLs still use `PUBLIC_SERVER_URL`.

Frontend `/s/:slug` is handled by a new SPA route that calls the backend resolver for tracking, then redirects to the real frontend target. This avoids exposing Railway/localhost/Netlify preview URLs in public share surfaces.

### Upload pipeline

Upload init is owner-scoped. Binary PUT upload URLs are generated against the backend/API origin. File types include standard images, HEIC/HEIF mobile images, and supported video formats. Local upload directory creation is hardened. Upload error copy now points to real causes: API base URL, CORS, public server URL, storage volume, and file limits.

Community branding upload permissions were tightened: group avatar/banner uploads now require owner/admin/site admin instead of any member. Community post uploads remain member-capable.

### Garage ownership isolation

Garage and media ownership helpers were added/hardened:
- vehicle ownership resolution
- media owner/admin checks
- vehicle access checks
- private vehicle filtering
- media reassignment only from assets owned by the acting user

User A cannot manage User B's vehicles/media through the normal routes. Admin inspection remains available and audit-backed.

### Message moderation

Admin message search is audit-logged. Admin can now hide/unhide or remove/restore messages through admin moderation routes. Public/community payloads filter hidden/deleted messages.

## Added / upgraded

### Backend

- `PUBLIC_APP_URL`, `FRONTEND_URL`, `ALLOWED_ORIGINS`, storage provider/env diagnostics.
- `getPublicAppUrl()` separate from `getPublicServerUrl()`.
- Runtime diagnostics exposed through admin overview.
- Backend vehicle registry API at `/api/vehicle-registry`.
- Expanded garage vehicle schema fields.
- Admin audit log search endpoint.
- Admin import source enable/disable endpoint.
- Stronger source adapter import architecture for Queensland Raceway and future sources.
- Frontend short-link resolver endpoint at `/api/links/resolve/:slug`.
- Admin message hide/delete moderation endpoints.
- Better site settings schema.

### Frontend

- New `/s/:slug` SPA resolver page.
- QR page always uses canonical `VITE_PUBLIC_APP_URL`/`https://statik.au`.
- Backend-backed smart garage vehicle selector with searchable comboboxes and dependent make/model/generation/trim/special-edition logic.
- Expanded garage dossier fields and presentation.
- Admin settings deployment/runtime health panel.
- Real audit log search page.
- Import source enable/disable controls.
- Admin message hide/remove controls.
- Upload API helper with stronger validation/progress/error reporting.

## Required backend env vars for Railway

```bash
PORT=3000
PUBLIC_APP_URL=https://statik.au
FRONTEND_URL=https://statik.au
ALLOWED_ORIGINS=https://statik.au,https://www.statik.au
PUBLIC_SERVER_URL=https://YOUR-RAILWAY-BACKEND-DOMAIN
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=use-a-long-random-password
ADMIN_DISPLAY_NAME=STATIK Admin
JWT_SECRET=use-a-long-random-secret-at-least-16-chars
MAX_UPLOAD_BYTES=41943040
STORAGE_PROVIDER=local
UPLOADS_DIR=/data/uploads
```

Optional object-storage envs when moving off local volume:

```bash
STORAGE_PROVIDER=s3
STORAGE_BUCKET=
STORAGE_REGION=
STORAGE_PUBLIC_URL=
STORAGE_ACCESS_KEY_ID=
STORAGE_SECRET_ACCESS_KEY=
```

## Required frontend env vars for Netlify

```bash
VITE_PUBLIC_APP_URL=https://statik.au
VITE_API_BASE_URL=https://YOUR-RAILWAY-BACKEND-DOMAIN
VITE_MAPBOX_TOKEN=pk_your_mapbox_token
```

Mapbox token can be blank, but then the location field falls back to manual lat/lng entry instead of pretending a real map exists.

## Railway backend setup

- Root directory: `statik-backend` if deploying backend folder directly.
- Build command: `npm install --no-audit --no-fund && npm run build`
- Start command: `npm run start:railway`
- Healthcheck: `/api/health`
- If using local upload/JSON persistence, mount a Railway volume at `/data` and set `UPLOADS_DIR=/data/uploads`.

## Netlify frontend setup

- Base directory: `statik-frontend`
- Build command: `npm ci --include=dev --no-audit --no-fund && npm run build`
- Publish directory: `dist`
- SPA redirect is already configured: `/* -> /index.html`.
- `/s/:slug` is handled by the frontend app, which calls the backend resolver and tracks QR/click analytics.

## Upload/storage notes

Current storage remains local filesystem-backed because this repo is still a JSON/local-file architecture. It works for one Railway backend instance only when the Railway volume is configured. For a production multi-instance backend, move media to S3/R2-compatible object storage and keep the existing signed-init/persistence pattern.

## statik.au QR/share routing notes

- User-facing links must use `PUBLIC_APP_URL` / `VITE_PUBLIC_APP_URL`.
- Backend upload and API calls must use `PUBLIC_SERVER_URL` / `VITE_API_BASE_URL`.
- Do not use Railway/Netlify preview/local origins for QR payloads.
- Netlify SPA redirect is enough for `/s/:slug`; no public proxy to the backend is required.

## Admin usage notes

- Use Admin Settings to check canonical URL, backend URL, storage provider, CORS origin, upload limit, and warnings.
- Use Admin Imports to run source adapters, enable/disable import sources, edit staged items, approve/reject/archive, or publish to public events.
- Use Admin Users to search users, inspect IPs/sessions/actions/groups/events/garage/media/short links, apply role/ban/suspend/verify/feature actions, and moderate messages.
- Use Audit Logs to search/filter operational logs.

## Build/test results in this container

Backend:
- `npm ci --include=dev --no-audit --no-fund` completed.
- `npm run build` completed successfully.

Frontend:
- `npm ci --no-audit --no-fund` installed dependencies.
- `npm run build` / Vite started but hung at `transforming...` in this container running Node 22, despite `package.json` specifying Node 20 and Netlify config specifying Node 20.
- A direct esbuild bundle of `src/main.tsx` completed successfully, which validates syntax/import graph at bundle level.

Action for Netlify:
- Netlify is configured to use Node 20. Run the Netlify build there or locally under Node 20. If Vite still hangs under Node 20, the next step is upgrading Vite/plugin-react from the old v4/v3 generation.

## Remaining production risks

- Local JSON + filesystem storage is not an enterprise persistence layer.
- Media is not transcoded or thumbnail-processed by a background worker.
- Import scraping still depends on the source website structure and legal/technical access; it is now staged and logged, not auto-published.
- Object storage envs are defined but a true S3/R2 adapter is not yet implemented in the current codebase.
