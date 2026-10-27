# BONCOTE — Product roadmap

BONCOTE is a French classified-ads marketplace: anyone can browse, search, and post ads for vehicles, property, furniture & home, electronics, and jobs. The roadmap is split into small, self-contained milestones. Built on Netlify (Database, Identity, Blobs, Image CDN, Functions).

## ✅ Milestone 1 — Product surface (done)
- Branded homepage: hero search (query, category, location), category tiles, "Annonces du moment" grid with category chips, "Déposer une annonce" CTA, trust section.
- Search results (`/recherche`) with category chips, max price, sort, empty state.
- Listing detail (`/annonce/:id`) with photo, criteria, description, seller card, safety tip, similar ads.
- Post-an-ad form (`/deposer`) with validation and live preview (not persisted).
- Favorites (`/favoris`) stored in the browser.
- Mobile-first layout with bottom tab bar; all data stubbed in `src/data/fixtures.ts`.

## Milestone 2 — Listings in Netlify Database
- Drizzle schema: `categories`, `listings` (title, description, price, price suffix, category, city, postcode, attributes JSON, flags, status, timestamps).
- Seed with the current fixtures; replace `fixtures.ts` reads with loaders / server functions.
- Server-side search & filtering (full-text on title/description, city/postcode, price, sort) with pagination.

## Milestone 3 — Accounts (Netlify Identity)
- Sign up / log in / password reset, "Mon compte" page, particulier vs professionnel profile.
- Protect `/deposer`; tie listings to their author.
- Move favorites from localStorage to the database per user.

## Milestone 4 — Posting & managing ads
- Persist the "Déposer une annonce" form; multi-photo upload to Netlify Blobs, served through the Image CDN.
- Category-specific fields (km/year for vehicles, surface/DPE for property, contract type for jobs).
- "Mes annonces": edit, mark as sold, delete; listing expiry.

## Milestone 5 — Messaging
- Buyer ↔ seller conversations per listing, inbox with unread counts, email notification of new messages.
- "Postuler" flow for job ads.

## Milestone 6 — Trust & moderation
- Report listing flow, admin moderation queue (Identity roles), basic spam/fraud checks.
- Seller ratings after a transaction.

## Milestone 7 — Growth & polish
- Saved searches with alerts, location radius search, SEO pages per category/city, legal pages (CGU, mentions légales, RGPD/cookies).
- Optional: secure payment & delivery partner integration.
