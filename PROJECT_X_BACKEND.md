# PROJECT X — Backend v0.1

This repository now contains the first real backend foundation for PROJECT X.

## What was implemented

- PostgreSQL/Drizzle schema for users, profiles, sessions, posts, audio, projects, creator stats, follows, conversations, messages, interactions, saved items, notes, ranking snapshots, and privacy settings.
- Secure password hashing with Node `scrypt`.
- HttpOnly session cookie authentication.
- Sign up, login, logout, and current-user endpoints.
- Profile lookup.
- Post creation and feed retrieval.
- Meaningful creator interactions: Helpful, Inspired, Learned, Collaborated.
- Creator statistics increment from real interactions.
- Safety-oriented ranking/privacy fields are stored in the database.

## Replit setup

1. Provision PostgreSQL and ensure `DATABASE_URL` exists.
2. Install dependencies with the repository's existing pnpm lockfile.
3. Push the schema:

```bash
pnpm --filter @workspace/db push
```

4. Start the API server using the existing workspace command.

The API is mounted under `/api` and health is available at `/api/healthz`.

## Current product boundary

The existing PROJECT X UI remains a prototype. The backend is deliberately introduced as a separate layer so the visual product is not rebuilt while the data foundation becomes real.

The next integration target is the vertical slice:

`Sign up → Login → Profile → Create Post/Reel → Save to DB → Helpful → Creator stats`

After that, realtime messaging, media storage, ranking calculation, and OAuth providers should be integrated one layer at a time.
