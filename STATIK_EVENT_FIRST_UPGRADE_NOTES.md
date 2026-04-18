# STATIK event-first upgrade notes

## Concise audit

### Kept
- Existing React 18 + TypeScript + Vite + Tailwind + Framer Motion frontend structure.
- Existing Express + TypeScript backend structure.
- Existing auth, profiles, communities, events, admin routes, and shop lock behavior.
- Existing dark, hard-edged, premium STATIK design language.

### Reworked in place
- Build Dossier Registry now supports structured enthusiast vehicle data with make/model dependency logic, trims, special editions, drivetrain, engine family, transmission, ownership state, purpose tags, and setup tags.
- Upload pipeline was fixed and hardened around direct binary uploads, MIME inference, mobile image handling, safer public URL generation, and Railway-compatible server origin resolution.
- Submit page is now a real event intake flow with structured categories, conditional fields, direct media uploads, map-backed location entry, and real backend submission records.
- Events index and event detail now push events to the center of the product hierarchy with richer cards, filters, source labeling, social response states, related events, and stronger hosted/sponsored treatment.
- Home page no longer emphasizes live member count. It now leads with flagship, sponsored, and upcoming events plus event-led reasons to join.
- Admin imports became a real staged external-event workflow with source health, import runs, staged records, edit-before-publish controls, and publish approval.
- Admin users became a real moderation surface with search, detail view, IP/session visibility, role changes, bans/suspensions, feature/verify controls, garage/media visibility, short links, reports, and message moderation search.
- Admin settings is now backend-connected rather than local-state-only.

## Key architecture decisions
- The repo already runs on a JSON-backed Express runtime rather than a full relational DB, so the upgrade extends that architecture instead of pretending a different backend already exists.
- Direct uploads remain production-style in flow: initialize upload, upload binary directly, persist metadata, then reattach records to final entities.
- Current storage remains local filesystem-backed. This is real and works for a single backend instance. The seam to object storage remains clean for later S3/R2 migration.
- Event imports are adapter-driven rather than hard-coded into one page, so more event sources can be added later without rewriting the approval workflow.

## Environment variables

### Backend
- `PORT`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `PUBLIC_SERVER_URL`
- `CLIENT_ORIGIN`
- `MAX_UPLOAD_BYTES` optional

### Frontend
- `VITE_API_BASE_URL`
- `VITE_MAPBOX_TOKEN` for autocomplete + draggable map pin experience

## Setup / migration
1. Install backend dependencies in `statik-backend`.
2. Install frontend dependencies in `statik-frontend`.
3. Set backend env vars, especially `PUBLIC_SERVER_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CLIENT_ORIGIN`.
4. Set frontend env vars, especially `VITE_API_BASE_URL` and `VITE_MAPBOX_TOKEN`.
5. Start backend.
6. Start frontend.
7. Existing runtime JSON state file remains at `statik-backend/data/runtime-db.json`; the store normalizer backfills new fields in place.

## Admin-gated / intentionally controlled
- Event submissions still require approval before public publish.
- Imported external events still stage in admin and do not auto-publish.
- Shop lock/unlock remains preserved.
- Message moderation access is admin-only and audit logged.
- Media deletion remains owner/admin controlled.

## Remaining production risks
- Uploads are real, but storage is still local-disk based. Multi-instance deployment should move to object storage.
- There is no separate media processing worker yet for transcoding, poster generation, or thumbnails.
- Analytics and moderation logs are real, but still lightweight and JSON-backed rather than warehouse/DB-backed.
- The current Mapbox UI depends on `VITE_MAPBOX_TOKEN`; without it, the form falls back truthfully to typed/manual location entry.
