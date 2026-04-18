# STATIK network expansion notes

## What was kept
- Existing React/Vite/Tailwind/Framer frontend structure.
- Existing Express + TypeScript backend structure.
- Existing auth, admin, event, friend, and community foundations.
- Existing dark/angular premium automotive visual direction.
- Existing shop lock / unlock behavior.

## What was reworked in-place
- Real direct upload architecture using signed upload sessions and binary PUT uploads.
- Profile system expanded with media posts, garage, short links, QR, and analytics.
- Community system expanded with group posts, join requests, hosted events, featured identity modules, richer settings, and moderation.
- Admin surface expanded for reports, uploaded media, community moderation, and deeper live counts.
- Public profile experience reworked around garage + profile traction + affiliations.

## Environment variables
Backend:
- `PORT`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `PUBLIC_SERVER_URL`  # absolute public backend URL used for uploads + short links
- `MAX_UPLOAD_BYTES`   # optional, defaults can remain if omitted
- `CLIENT_ORIGIN`

Frontend:
- `VITE_API_BASE_URL`  # public backend base URL, no trailing slash preferred

## Storage
Current implementation uses local backend filesystem storage at `statik-backend/data/uploads` with signed upload initialization, metadata persistence, and deletion lifecycle.

For single-instance deployment this works as-is.
For multi-instance / production scale, swap the storage adapter to S3 / R2 / similar object storage while keeping the same metadata + signed-upload flow.

## Setup
1. Install frontend dependencies in `statik-frontend`.
2. Install backend dependencies in `statik-backend`.
3. Set backend env vars, especially `PUBLIC_SERVER_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CLIENT_ORIGIN`.
4. Set frontend `VITE_API_BASE_URL`.
5. Start backend.
6. Start frontend.
7. Existing runtime JSON data file remains at `statik-backend/data/runtime-db.json`.

## Intentionally controlled / admin-sensitive
- Event approval still required before public publish.
- Shop lock/unlock preserved.
- Media deletion available to owner and admin.
- Reports, media, and community discovery moderation exposed in admin.

## Remaining production risks
- Local-disk uploads should be replaced with object storage for horizontal scaling.
- There is still no separate media transcoding / thumbnail worker.
- Analytics are real tracked events, but they are lightweight and file-backed rather than warehouse-backed.
- The backend remains a JSON-store architecture; moving to Postgres/Prisma later would be the enterprise-grade next step.
