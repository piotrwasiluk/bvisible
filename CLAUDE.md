# bVisible - AEO Search Visibility Platform

## Project Overview

AEO (Answer Engine Optimization) monitoring platform that tracks brand visibility across AI search engines. Built as a pnpm monorepo on Replit.

## Tech Stack

- **Runtime**: Node.js 24, pnpm workspaces
- **Language**: TypeScript 5.9 (strict, composite projects)
- **Frontend**: React 19, Vite 7, Tailwind CSS v4, Wouter (routing), React Query, Framer Motion
- **Backend**: Express 5, Zod (validation), Pino (logging)
- **Database**: PostgreSQL + Drizzle ORM
- **API Codegen**: OpenAPI 3.1 spec + Orval -> generates React Query hooks and Zod schemas
- **Build**: esbuild (api-server), Vite (frontends)
- **UI Components**: Radix UI primitives + shadcn/ui patterns, Lucide icons

## Monorepo Structure

```
artifacts/           # Deployable apps
  api-server/        # Express 5 API (@workspace/api-server)
  be-visible/        # Main React frontend (@workspace/be-visible)
  mockup-sandbox/    # Design prototyping app (@workspace/mockup-sandbox)
lib/                 # Shared libraries
  ai-engine/         # AI query engine + analysis pipeline (@workspace/ai-engine)
  api-spec/          # OpenAPI spec + Orval config (@workspace/api-spec)
  api-client-react/  # Generated React Query hooks (@workspace/api-client-react)
  api-zod/           # Generated Zod schemas (@workspace/api-zod)
  db/                # Drizzle ORM schema + connection (@workspace/db)
scripts/             # Utility scripts (@workspace/scripts)
```

## Key Commands

```bash
# Root
pnpm run build                  # Typecheck all, then build all packages
pnpm run typecheck              # tsc --build (project references)

# API Server
pnpm --filter @workspace/api-server run dev    # Dev server
pnpm --filter @workspace/api-server run build  # Production bundle

# Frontend
pnpm --filter @workspace/be-visible run dev    # Vite dev server

# Database
pnpm --filter @workspace/db run push           # Push schema to DB
pnpm --filter @workspace/db run push-force     # Force push (destructive)

# API Codegen
pnpm --filter @workspace/api-spec run codegen  # Regenerate hooks + schemas from OpenAPI

# Seed Data
pnpm --filter @workspace/scripts run seed      # Populate DB with demo data
```

## TypeScript Rules

- Every package extends `tsconfig.base.json` (composite: true, bundler resolution, es2022)
- **Always typecheck from root** — `pnpm run typecheck`. Single-package tsc will fail if dependencies aren't built.
- `tsc --build` emits `.d.ts` only; JS bundling is handled by esbuild/Vite
- Cross-package imports require project references in `tsconfig.json`
- New lib packages must be added to root `tsconfig.json` references array

## Architecture Patterns

### API Server

- Entry: `src/index.ts` -> `src/app.ts` (mounts CORS, JSON parsing, routes at `/api`)
- Routes: `src/routes/index.ts` mounts sub-routers
- Validation: request/response validated with `@workspace/api-zod` schemas
- DB access: via `@workspace/db` (Drizzle ORM)

### Frontend (be-visible)

- Entry: `src/main.tsx` -> `src/App.tsx`
- Routing: Wouter. `/` is landing page, `/app` redirects to `/setup` or `/overview`
- Layout: `src/components/AppLayout.tsx` (sidebar nav + top bar + global filter bar)
- Global Filters: `src/hooks/use-global-filters.ts` — URL search params shared across pages
- All pages fetch data via generated React Query hooks (no hardcoded data)
- Design system: monochrome Linear-inspired, Inter (UI text), JetBrains Mono (labels/mono accents)

### API Codegen Flow

1. Edit `lib/api-spec/openapi.yaml`
2. Run `pnpm --filter @workspace/api-spec run codegen`
3. Generates into `lib/api-client-react/src/generated/` and `lib/api-zod/src/generated/`

### Database

- Schema files: `lib/db/src/schema/<model>.ts`
- Uses `drizzle-zod` for insert schemas
- Migrations via `drizzle-kit push` (Replit handles production migrations on publish)

### AI Engine

- See `docs/ai-engine.md` for full documentation
- Query engine + analysis pipeline in `lib/ai-engine/`
- Queries 5 AI platforms with web search, analyzes responses, stores in DB
- Runs daily via node-cron, manual trigger via `POST /api/analysis/run`

## Code Conventions

- ESM everywhere (`"type": "module"`)
- Zod v4 for validation (`zod/v4`)
- Use workspace protocol for internal deps (`"@workspace/db": "workspace:*"`)
- Catalog versions in `pnpm-workspace.yaml` for shared deps
- No README files unless explicitly requested

## Verification Workflow

After making changes, always verify before claiming done:

1. **Typecheck**: `pnpm run typecheck` — must pass with zero errors
2. **Build**: `pnpm run build` — must succeed
3. **API changes**: Start server with `pnpm --filter @workspace/api-server run dev`, then curl endpoints
4. **UI changes**: Start frontend with `pnpm --filter @workspace/be-visible run dev`, then use Playwright to navigate and screenshot the running app to visually confirm
5. **DB schema changes**: Run `pnpm --filter @workspace/db run push` and verify migration succeeds
6. **API codegen**: After editing `openapi.yaml`, run codegen and typecheck to ensure generated code is valid

Never claim something works without running verification. If a verification step fails, fix before proceeding.

## Environment

- Hosted on **Replit** — Claude Code runs via shell in the Replit workspace
- `DATABASE_URL` — automatically provided by Replit (PostgreSQL)
- `PORT` — API server port
- Production deployments happen via Replit's "Publish" (handles DB migrations automatically)
- The dev server binds to `0.0.0.0` (required for Replit's proxy to expose ports)
- No local Docker, no CI/CD pipelines — Replit handles builds and hosting
