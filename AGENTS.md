# AGENTS.md

This document describes the project for developers and AI agents working on this codebase.

## Project Overview

BONCOTE is a French classified-ads marketplace (similar to Leboncoin). It is a standalone project with no relation to, or shared code with, any other site of the owner (notably BOUS BTP). All UI copy is in French.

**Current state: milestone 1 of the roadmap.** The product surface is built (home, search, listing detail, post-an-ad, favorites) on top of stubbed data. There is no database, auth, or server logic yet. **Read `PLAN.md` and continue from the next unchecked milestone.**

### Tech Stack

| Layer         | Technology                                          |
| ------------- | --------------------------------------------------- |
| Framework     | TanStack Start                                      |
| Frontend      | React 19, TanStack Router                           |
| Build         | Vite 8                                              |
| Styling       | Tailwind CSS 4, theme variables in `src/styles.css` |
| UI Components | shadcn/ui (Radix UI + Tailwind)                     |
| Toasts        | sonner                                              |
| Icons         | lucide-react                                        |
| Language      | TypeScript 6.0 (strict mode)                        |
| Deployment    | Netlify, via `@netlify/vite-plugin-tanstack-start`  |

## Directory Structure

```
├── PLAN.md                 # Product roadmap — start here for the next milestone.
├── public/img/             # AI-generated listing photos (served via the Netlify Image CDN).
├── src
│   ├── components
│   │   ├── boncote/        # Product components: SiteLayout (header, category nav, footer, mobile tab bar),
│   │   │                   # SearchBar, ListingCard, FavoriteButton, CategoryIcon, Logo.
│   │   ├── error-pages.tsx # Themed 404 and route error pages.
│   │   └── ui/             # shadcn/ui primitives.
│   ├── data/fixtures.ts    # ALL stubbed data (categories, listings). Swap for DB queries in milestone 2.
│   ├── lib
│   │   ├── favorites.ts    # localStorage-backed favorites store (useSyncExternalStore, SSR-safe).
│   │   ├── format.ts       # fr-FR price/count/date formatting, imageUrl() for the Image CDN.
│   │   └── utils.ts        # cn() helper.
│   ├── routes
│   │   ├── __root.tsx      # HTML shell (lang="fr"), metadata, Google Fonts links.
│   │   ├── index.tsx       # / — hero + search, categories, recent listings, sell CTA.
│   │   ├── recherche.tsx   # /recherche — results with typed search params (q, categorie, lieu, prixMax, tri).
│   │   ├── annonce.$id.tsx # /annonce/:id — listing detail, seller card, similar listings.
│   │   ├── deposer.tsx     # /deposer — "Déposer une annonce" form with live preview (not persisted yet).
│   │   └── favoris.tsx     # /favoris — saved listings.
│   └── styles.css          # Theme: coral primary, navy `ink`, `sea` accent; Bricolage Grotesque + Figtree.
```

## Non-obvious decisions

- Every page wraps its content in `SiteLayout`; it is not in `__root.tsx` so error pages stay minimal.
- Listing photos always go through `imageUrl(file, width)` (Netlify Image CDN) — never link `/img/*.png` directly.
- Relative dates in `formatPosted` use a fixed preview "now" so SSR and client match; replace with real timestamps once listings come from the database.
- Messaging, login, phone reveal and reporting are deliberate "coming soon" toasts until their milestones land.
- Search filtering runs client-side over fixtures; move it to a server function/query in milestone 2.
- Custom theme colors: `bg-ink`/`text-ink-foreground` (navy), `text-sea` (trust/delivery accent).

## Key Concepts

### File-Based Routing

Route files in `src/routes/` define pages and endpoints:

- `__root.tsx` wraps every page.
- `index.tsx` is `/`.
- `about.tsx` would be `/about`.
- `api.*.ts` files are server API endpoints. See the `tanstack-start-api-routes` skill.

### Theme Variables

Colors and corner radius are CSS variables in `src/styles.css` (`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--radius`, and more), with a second set under `.dark`. Tailwind exposes them as classes such as `bg-primary`, `text-muted-foreground`, and `border-border`.

Set these variables for the product before you build any page. In components, use the variable classes instead of raw colors like `bg-white` or `text-gray-600`, so the whole site changes when a variable changes.

### UI Components

Ready-made components are in `src/components/ui/`. Use them before writing your own, and restyle them through the theme variables or their variants. Add more with `npx shadcn add <name>`. Show a toast by calling `toast()` from `sonner`; the container is already mounted in `__root.tsx`. `TooltipProvider` is mounted there too, so `Tooltip` works anywhere without its own provider.

| Need               | Components                                                         |
| ------------------ | ------------------------------------------------------------------ |
| Actions and status | Button, Badge, Progress, Skeleton, Alert, Sonner                   |
| Forms              | Input, Textarea, Label, Checkbox, RadioGroup, Switch, Select, Form |
| Overlays and menus | Dialog, Sheet, Popover, DropdownMenu, Tooltip                      |
| Content and layout | Card, Tabs, Accordion, Separator, Table                            |

Use `Form` with React Hook Form and the Zod resolver. Start from `src/examples/validated-form.tsx`; it isn't mounted or connected to a backend. Its required `onSubmit` callback must reject on failure. See [the form pattern](docs/forms.md) for HTTP submission and error handling.

Use Sheet for a mobile menu and DropdownMenu for short action lists. Give Dialog and Sheet an accessible title and description. Pair Checkbox, RadioGroup, Switch, and inputs with visible labels. Reserve tables for tabular data and wrap them in their provided scroll container.

### Design Choices

- Set `--font-body` and `--font-heading` in `src/styles.css`. Use `font-display` for headings when the product needs a separate heading font.
- Use `max-w-content` for a page container and `max-w-reading` for long text. Keep consistent horizontal padding, such as `px-4 sm:px-6`, and a small repeated spacing scale, such as `gap-4`, `gap-6`, and `py-12`.
- Keep one main heading per page and a clear heading order. Use muted text for supporting copy, not essential low-contrast labels.
- Preserve focus rings. Give icon-only buttons an accessible name. Ensure actions work with a keyboard and on narrow screens.
- Use short color/opacity transitions. Add `motion-reduce:transition-none` or `motion-reduce:animate-none` when adding motion; don't make essential content depend on animation.
- Provide loading, empty, error, and success states for each data-driven screen. Skeletons should follow the shape of the content they replace.

### Routing and Server Data

Router types are registered in `src/router.tsx`, so use typed `Link` destinations and route parameters. The root route supplies the themed 404 page; the router's default error component supplies the safe retry/home page, including child-route SSR failures. Use `throw notFound()` for absent records; keep unexpected failures on the error path. See [routing conventions](src/routes/README.md).

Start with route loaders and server functions for server data. Validate server-function input with `.validator(...)`, keep secrets on the server, and handle HTTP failures before returning data. See [the data-fetching pattern](docs/data-fetching.md). Add TanStack Query only when client-side caching, mutations, or background refresh are needed.

### Browser Storage

Pages are rendered on the server first, where `window` and `localStorage` don't exist. Read `localStorage` inside `useEffect`, not during render or in a `useState` initializer, or the first render will differ from the server HTML and React will log a hydration error.

## Configuration Files

| File             | Purpose                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| `vite.config.ts` | Vite path aliases and Tailwind, Netlify, TanStack Start, React plugins                           |
| `tsconfig.json`  | Strict TypeScript, with the `@/*` alias for `src/*`                                              |
| `netlify.toml`   | Builds with `vite build`, publishes `dist/client`, dev server on port 8888 proxying Vite on 3000 |

## Development Commands

Use Node 22.13+ on the Node 22 line, Node 24, or Node 26+. The installed lint and test tools set this minimum alongside the framework.

```bash
npm run dev        # Start the Vite dev server on port 3000
npm run build      # Production build
npm run typecheck  # Type-check with tsc; the build doesn't
npm run lint       # Check TypeScript and React Hooks rules
npm run format:check # Check formatting
npm run format     # Format project files
npm test           # Run local form, control, and error page tests
npm run preview    # Preview the production build
```

## Conventions

- Components: PascalCase. Utilities and hooks: camelCase. Route files: kebab-case.
- Import from `src` with the `@/` alias.
- TypeScript fails on unused locals and parameters, so remove what you don't use.
- Use React hooks for state.
- Run the dev server or build once to generate route types before type-checking a fresh copy.
- Run build, typecheck, lint, format:check, and tests before reporting completion. Verify changed user flows locally; a passing build doesn't prove an interaction works.

## Application Name

Set the product's name and description in `src/routes/__root.tsx`:

- `siteName` is the page title and the title shown when the link is shared.
- `siteDescription` is the meta description and the description shown when the link is shared.

The home page lives in `src/routes/index.tsx`.
