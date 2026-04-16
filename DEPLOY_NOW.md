# STATIK deploy-now package

This repo has been hardened so you can:
- push the full repo to GitHub
- deploy the frontend to Netlify from `netlify.toml`
- deploy the backend to Railway from `railway.json`
- boot the site immediately in fallback mode even if Stripe and database values are still blank

## Frontend
- Deploy target: `statik-frontend`
- Config file: `/netlify.toml` or `/statik-frontend/netlify.toml`
- Safe default env file: `/statik-frontend/.env`
- Output: `dist`

## Backend
- Deploy target: repo root with `/railway.json`, or backend folder with `/statik-backend/railway.json`
- Safe default env file: `/statik-backend/.env`
- Healthcheck: `/api/health`
- The backend now boots in launch-safe fallback mode without requiring a live database.

## Live mode later
When you are ready to wire real services, update:
- `statik-frontend/.env` -> `VITE_API_BASE_URL`
- `statik-backend/.env` -> `FRONTEND_URL`, `ALLOWED_ORIGINS`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `DATABASE_URL`
