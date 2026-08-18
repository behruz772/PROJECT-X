# PROJECT X — Architecture v0.1

## Source of truth

`artifacts/project-x` remains the existing product UI/prototype. It is not redesigned by this backend pass.

## Backend boundary

`artifacts/api-server` exposes `/api` endpoints.

`lib/db` owns the PostgreSQL/Drizzle schema.

## First real vertical slice

1. Account creation
2. Session cookie
3. Current user/profile
4. Post creation
5. Feed retrieval
6. Helpful / Inspired / Learned / Collaborated interactions
7. Creator counters

## Core domain model

Identity → Social Graph → Content → Reputation → Communication.

The database schema intentionally includes the next domains so future developers extend a stable model instead of creating unrelated local stores.
