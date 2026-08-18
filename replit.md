# PROJECT X

PROJECT X is a creator-focused social workspace for publishing, discovering, collaborating, and communicating across the world.

## Run & Operate

- `pnpm --filter @workspace/project-x run dev` — run the PROJECT X web app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/project-x/src/app/App.tsx` — existing PROJECT X shell, navigation, original pages, and integrated feature routes
- `artifacts/project-x/src/app/FeaturePages.tsx` — Stories, audio, saved collections, notes, account, search, drafts, activity, and safety surfaces
- `artifacts/project-x/src/styles/theme.css` — PROJECT X light/dark theme tokens
- `attached_assets/` — original uploaded source archive and feature brief

## Architecture decisions

- The uploaded PROJECT X interface remains the source of truth for existing screens and navigation.
- New prototype flows use local React state with localStorage persistence so account, notes, saved items, drafts, and session state survive a refresh.
- Music is represented by fictional, rights-managed demo tracks with license metadata; no commercial audio is used.
- Feature routes are integrated into the existing app shell instead of replacing the original pages.

## Product

Users can create and view Stories, discover and reuse demo audio, save content into collections, keep private notes, message creators with translation assistance, search the creator ecosystem, review notifications and activity, continue drafts, and manage safety and account flows.

## User preferences

- Preserve the existing PROJECT X design and feature set; add missing capabilities without redesigning existing pages.

## Gotchas

- The artifact workflow supplies `PORT` and `BASE_PATH`; direct Vite builds need those environment variables set.
- The prototype intentionally uses localStorage and demo content rather than a backend or real music rights provider.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
