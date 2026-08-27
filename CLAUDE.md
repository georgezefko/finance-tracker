# CLAUDE.md

Guidance for Claude Code working in this repo. See `README.md` for human setup,
screenshots, and architecture diagrams — this file is the working cheat sheet.

## What this is

Containerized personal-finance dashboard (expense analytics + net worth).
Monorepo, three workspaces:

- `backend/` — Express + TypeScript REST API. Raw SQL via `pg` (no ORM). JWT auth, Zod validation.
- `frontend/` — React 18 + TypeScript (CRA), MUI, Recharts, React Router.
- `database/` — `node-pg-migrate` migrations (SQL files).

## Commands

```bash
# Backend  (cd backend)
npm run build        # rimraf dist && tsc  — use this to typecheck
npm run dev          # tsc -w & nodemon

# Frontend (cd frontend)
npm run build        # react-scripts build — use this to typecheck/verify
npm start            # dev server

# Database (cd database)
npm run build && npm run migrate:up   # apply migrations
npm run migrate:down                  # roll back last

# Full stack
docker-compose up    # backend :8000, frontend :3001, postgres :5432, migrations
```

## Architecture

Backend modules follow `routes → controller → service → db`:

- `backend/src/tracker.ts` — app entry; route mounting + **global error handler** (formats `ZodError` → 422).
- `backend/src/modules/{auth,cashflow,networth}/` — each has `.routes.ts`, `.controller.ts`, `.service.ts`.
- `backend/src/middleware/is-auth.ts` — JWT verify; sets `req.userId`.
- `backend/src/db_conn/db.ts` — single `query()` over a `pg` Pool.
- Frontend entry `frontend/src/App.tsx`; state via React Context (`AuthContext`, `YearContext`); API calls go through `frontend/src/utils/apiFetch.ts`.

## Conventions & gotchas

- **Conventional Commits are mandatory.** `semantic-release` derives versions from commit type (`feat`→minor, `fix`→patch, `BREAKING CHANGE`→major; `chore`/`docs`/`ci` → no release). See `.releaserc`. A non-conforming commit message breaks the release pipeline.
- **Raw SQL only.** Queries live in `*.service.ts`. Some logic is in Postgres functions called from services (`get_income_expense`, `get_financial_metrics`) — defined in `database/` migrations, not in TS.
- **Input validation** is Zod in controllers; let errors hit `next(err)` so the global handler in `tracker.ts` formats them. Don't add per-handler `ZodError` catches.
- **All user data is scoped** by `req.userId` (set by `is-auth`); every data query filters on `user_id`.
- The cashflow controller imports its service as `feedService` (historical alias) — same `routes→controller→service` pattern, just a legacy name.
- **No real test suite.** `npm test` is a stub on backend/database; the frontend test is CRA boilerplate. Verify changes with `npm run build` in the affected workspace + a manual smoke test via `docker-compose up`.

## Workflow

- Branch off `master`; open a PR. The user reviews and merges (don't merge for them).
- Run the relevant `npm run build` before pushing.
- `gh` CLI may not be available in this environment — check before relying on it.
