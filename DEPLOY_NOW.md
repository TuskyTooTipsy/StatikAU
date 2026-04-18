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
MAX_UPLOAD_BYTES=41943040
STORAGE_PROVIDER=local
UPLOADS_DIR=/data/uploads
```

Add a Railway volume mounted at `/data` while local storage is active.

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
