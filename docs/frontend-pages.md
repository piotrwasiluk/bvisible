# Frontend Pages

All pages in `artifacts/be-visible/src/pages/`. Routes defined in `App.tsx`.

## Public Pages (no auth required, no AppLayout)

| Route               | File                   | Description                                                              |
| ------------------- | ---------------------- | ------------------------------------------------------------------------ |
| `/`                 | `landing.tsx`          | Marketing landing page with hero, features, CTAs                         |
| `/login`            | `login.tsx`            | OAuth placeholder login (Google + email form, non-functional)            |
| `/audit`            | `audit.tsx`            | Multi-step audit wizard (website input → prompts → analysis → dashboard) |
| `/contact`          | `contact.tsx`          | Contact page with email (piotrw.wasiluk@gmail.com) and form placeholder  |
| `/blog`             | `blog.tsx`             | Blog index with 8 placeholder articles, category filtering               |
| `/blog/:slug`       | `blog-article.tsx`     | Individual article page with related articles                            |
| `/docs`             | `docs.tsx`             | Documentation with sidebar navigation and section content                |
| `/docs/:section`    | `docs.tsx`             | Deep-linkable doc sections                                               |
| `/features/chatgpt` | `feature-chatgpt.tsx`  | ChatGPT Visibility Tracker feature page                                  |
| `/features/gemini`  | `feature-gemini.tsx`   | Gemini Visibility Tracker feature page                                   |
| `/features/claude`  | `feature-claude.tsx`   | Claude Visibility Tracker feature page                                   |
| `/compare/peec`     | `compare-peec.tsx`     | bVisible vs Peec AI comparison                                           |
| `/compare/profound` | `compare-profound.tsx` | bVisible vs Profound comparison                                          |
| `/compare/semrush`  | `compare-semrush.tsx`  | bVisible vs Semrush comparison                                           |
| `/compare/ahrefs`   | `compare-ahrefs.tsx`   | bVisible vs Ahrefs Brand Radar comparison                                |

## App Pages (wrapped in AppLayout, require workspace)

| Route                  | File                      | Description                                                       |
| ---------------------- | ------------------------- | ----------------------------------------------------------------- |
| `/setup`               | `setup.tsx`               | Workspace configuration form                                      |
| `/overview`            | `overview.tsx`            | Executive dashboard — KPIs, platform bars, competitor leaderboard |
| `/visibility`          | `visibility.tsx`          | Time series, leaderboards, topic bars, heatmap                    |
| `/citations-analytics` | `citations-analytics.tsx` | Citation KPIs, domain trends, top domains/URLs                    |
| `/community`           | `community.tsx`           | Reddit citation analytics                                         |
| `/sentiment`           | `sentiment.tsx`           | Sentiment score, themes table (sortable), treemap                 |
| `/prompts`             | `prompts.tsx`             | Prompt list with search, sort, topic grouping                     |
| `/pages`               | `pages.tsx`               | Page-level SEO + citation metrics, folder view                    |
| `/citations-detail`    | `citations-detail.tsx`    | Citation URL/domain table with CSV export                         |
| `/opportunities`       | `opportunities.tsx`       | Content gaps and off-site placements                              |
| `/reports`             | `reports.tsx`             | Report builder and saved reports                                  |
| `/settings`            | `settings.tsx`            | Workspace settings                                                |

## Audit Flow (`/audit`)

4-step wizard. Each audit creates a **new free workspace** for the audited company (separate from paid workspaces).

1. **Website Input** — Enter URL, optional brand name. Calls `POST /api/audit/generate-prompts` which uses Gemini to generate 10 prompts and creates a new workspace with `type: "free"`.
2. **Review Prompts** — Editable list of generated prompts. Free tier: max 10. Users can add, edit, delete prompts.
3. **Running Analysis** — Animated progress showing each AI platform being queried (OpenAI → Gemini → Perplexity → Claude → Google AI Mode) with checkmarks. Polls `/api/audit/status`.
4. **Complete** — Success screen, auto-redirects to `/overview?workspaceId=<id>` after 3 seconds, routing the user to their audit workspace's dashboard.

## Global Filters

Persistent filter bar in `AppLayout.tsx` (visible on all app pages):

- **Workspace ID** — Scopes all data to a specific workspace. Preserved across sidebar navigation. When absent, defaults to the first paid workspace.
- Date Range (7d/14d/30d/90d)
- Region
- Platform
- Topic
- Competitor

State managed via URL search params (`use-global-filters.ts`). All analytics React Query hooks include filter params (including `workspaceId`) in their query key. The sidebar nav links in `AppLayout.tsx` preserve the `workspaceId` param when navigating between pages.
