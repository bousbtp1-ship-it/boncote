# BONCOTE

**BONCOTE** is a French classified-ads marketplace — « Tout se vend, tout s’achète, juste à côté. » Visitors can search ads by keyword, category, and location, browse vehicles, property, furniture & home, electronics, and job offers, view listing details, save favorites, and start posting an ad via **Déposer une annonce**.

This is a standalone project, fully separate from BOUS BTP.

## Current state

The full product surface is clickable, using sample listings:

- `/` — homepage with search bar, categories, recent listings, and sell CTA
- `/recherche` — search results with filters and sorting
- `/annonce/:id` — listing detail
- `/deposer` — post-an-ad form with live preview
- `/favoris` — saved listings (stored in the browser)

Sample data lives in `src/data/fixtures.ts`. Listing photos are in `public/img/` and served through the Netlify Image CDN.

## Tech stack

- TanStack Start (React 19, TanStack Router) on Vite
- Tailwind CSS 4 + shadcn/ui components, lucide icons
- Deployed on Netlify

## Run locally

```bash
pnpm install
netlify dev        # or: pnpm dev
```

## Roadmap

See [PLAN.md](PLAN.md). Next up: listings in Netlify Database, accounts with Netlify Identity, persisted ad posting with photo uploads, buyer–seller messaging, and moderation.
