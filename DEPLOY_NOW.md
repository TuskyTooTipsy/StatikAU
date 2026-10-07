# Deploy STATIK

## Railway backend

Root/base: `statik-backend`

Build:
```bash
npm install --no-audit --no-fund && npm run build
```

Start:
```bash
npm run start:railway
```

Healthcheck:
```txt
/api/health
```

Required env:
```bash
PUBLIC_APP_URL=https://statik.au
FRONTEND_URL=https://statik.au
ALLOWED_ORIGINS=https://statik.au,https://www.statik.au
PUBLIC_SERVER_URL=https://YOUR-RAILWAY-BACKEND-DOMAIN
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
ADMIN_DISPLAY_NAME=STATIK Admin
JWT_SECRET=...
UPLOAD_SIGNING_SECRET=...
MAX_UPLOAD_BYTES=41943040
STORAGE_PROVIDER=local
UPLOADS_DIR=/data/uploads
```

Add a Railway volume mounted at `/data` while local storage is active.

Public registration never grants administrator access. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` to create the initial administrator. Production startup stops if no administrator exists without those credentials, or if `UPLOAD_SIGNING_SECRET` is missing. Use a random secret of at least 32 characters for upload signing.

## Netlify frontend

Base: `statik-frontend`

Build:
```bash
npm ci --include=dev --no-audit --no-fund && npm run build
```

Publish:
```txt
dist
```

Required env:
```bash
VITE_PUBLIC_APP_URL=https://statik.au
VITE_API_BASE_URL=https://YOUR-RAILWAY-BACKEND-DOMAIN
VITE_MAPBOX_TOKEN=...
```

The SPA redirect is already configured. `/s/:slug` stays on statik.au, tracks through the backend resolver, then redirects inside the frontend.

## STATIK master corrective v3 env additions

Backend Railway must include:

```bash
PUBLIC_APP_URL=https://statik.au
FRONTEND_URL=https://statik.au
ALLOWED_ORIGINS=https://statik.au,https://www.statik.au
PUBLIC_SERVER_URL=https://YOUR-RAILWAY-BACKEND-DOMAIN
UPLOADS_DIR=/data/uploads
STORAGE_PROVIDER=local
AI_PROVIDER=openai
AI_API_KEY=
AI_MODEL=gpt-4o-mini
GOOGLE_MAPS_API_KEY=
```

Frontend Netlify must include:

```bash
VITE_PUBLIC_APP_URL=https://statik.au
VITE_API_BASE_URL=https://YOUR-RAILWAY-BACKEND-DOMAIN
VITE_GOOGLE_MAPS_API_KEY=
```

For local Railway storage, mount a persistent Railway volume at `/data` before relying on production media persistence.
