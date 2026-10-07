# STATIK implementation summary

## What was kept
- Existing React + TypeScript + Vite frontend structure
- Existing Express backend structure
- Existing product/catalog code path, but demoted behind a real admin-controlled shop lock
- Existing brand assets in `public/brand`

## What was removed from the live experience
- Mock platform routing as the live source of truth
- Store-first navigation emphasis
- Soft/rounded visual language in the live routed experience
- Fake/placeholder live states on the primary pages

## What was reworked
- Public funnel now centers on events, profiles, communities, and sign-up value
- Members area now centers on real account-gated discovery, friends, communities, and chat
- Admin area now controls shop lock, profile featuring/verification/promotion, and event approval/featuring
- Home, events, profile, shop, admin, and member pages were rebuilt to use real API state

## Real systems now wired
- Registration and sign-in
- Administrator creation through the configured `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables
- Profile editing
- Event submission and admin approval
- Event RSVP states: interested / attending / maybe
- Featured event surfacing from real approved data
- Friend requests, accept/reject, remove
- Community creation, join/leave
- Group chat with text messages
- Event mentions inside chat
- Privacy-aware browser geolocation sharing inside chat
- Community owner/admin moderation: promote/demote admins, kick members, delete messages
- Admin-controlled shop lock
- Truthful empty states across the live routes

## Operational notes
- Runtime persistence is file-backed in `statik-backend/data/runtime-db.json`
- Default state is empty and production-safe; nothing is pre-seeded into the live network layer
- Public registrations always create standard user accounts. Production startup fails closed when no administrator exists and bootstrap credentials are missing.
