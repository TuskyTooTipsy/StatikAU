# STATIK Repo Audit and Gap Analysis

## Current architecture found

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS
- Framer Motion
- React Router
- Zustand cart state
- Existing pages: Home, Shop, Product Detail, About, Contact, Lookbook, FAQ, Shipping, Returns, Cart
- Existing design direction already dark and premium but still commerce-first

### Backend
- Express + TypeScript
- Prisma + PostgreSQL
- Existing routes: products, collections, checkout, contact, newsletter
- Existing domain coverage: catalog, variants, images, orders, customers, newsletter, contact, checkout flow

## Reusable systems
- Existing frontend shell, Tailwind theme, cart state, checkout/cart foundations
- Existing product, collection, and product detail foundations
- Existing contact and newsletter ingestion
- Existing Prisma catalog and order schema
- Existing deployment scaffolding

## Missing systems before this revamp
- Events platform
- Event detail pages
- Event import staging architecture
- Official STATIK feed
- User accounts and profile system
- QR code profile system
- Profile analytics surfaces
- Community submission system
- Admin command center
- Search across platform entities
- Maintenance mode handling
- Site announcements
- Role/permission model
- Moderation pipeline and audit concepts
- Community-first IA where shop is secondary

## Gap summary
The old site was a premium dark store with editorial hints. The target product is an events-first automotive culture platform with identity, moderation, admin operations, and multiple monetization rails. That required a major expansion of information architecture, domain modeling, and navigation priorities rather than a cosmetic reskin.
