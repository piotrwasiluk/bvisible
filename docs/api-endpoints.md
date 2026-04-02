# API Endpoints

All endpoints are mounted under `/api`. Defined in `lib/api-spec/openapi.yaml`.

## Workspace

| Method | Path                 | Description                                              |
| ------ | -------------------- | -------------------------------------------------------- |
| `GET`  | `/api/workspace`     | Get default paid workspace config                        |
| `GET`  | `/api/workspace/:id` | Get workspace by ID (supports both paid and free)        |
| `POST` | `/api/workspace`     | Create or update paid workspace (upsert, paid type only) |

## Analytics

All analytics and data endpoints accept these query params (global filters):

| Param         | Type                              | Default              | Description                                           |
| ------------- | --------------------------------- | -------------------- | ----------------------------------------------------- |
| `workspaceId` | integer                           | first paid workspace | Workspace to scope data to. Required for free audits. |
| `dateRange`   | `"7d" \| "14d" \| "30d" \| "90d"` | `"7d"`               | Time period                                           |
| `platform`    | string                            | —                    | Filter by AI platform                                 |
| `topic`       | string                            | —                    | Filter by topic cluster                               |
| `competitor`  | string                            | —                    | Filter by competitor                                  |
| `region`      | string                            | —                    | Filter by region                                      |

| Method | Path                           | Description                                                                                         |
| ------ | ------------------------------ | --------------------------------------------------------------------------------------------------- |
| `GET`  | `/api/analytics/overview`      | KPI cards + platform breakdown + competitor leaderboard                                             |
| `GET`  | `/api/analytics/visibility`    | Time series + leaderboards + topic bars + heatmap                                                   |
| `GET`  | `/api/analytics/citations`     | Citation KPIs + domain/competitor trends + top domains/URLs + heatmap                               |
| `GET`  | `/api/analytics/community`     | Reddit KPIs + subreddit breakdown + top URLs                                                        |
| `GET`  | `/api/analytics/sentiment`     | Score time series + themes table + treemap (also accepts `sentimentFilter=all\|positive\|negative`) |
| `GET`  | `/api/analytics/opportunities` | Content gaps + off-site placement opportunities                                                     |

## Data Tables

Paginated endpoints with sorting and search.

| Param    | Type    | Default | Description                                                        |
| -------- | ------- | ------- | ------------------------------------------------------------------ |
| `page`   | integer | 1       | Page number                                                        |
| `limit`  | integer | 50      | Items per page (max 100)                                           |
| `sort`   | string  | —       | Sort field, prefix with `-` for descending (e.g., `-citationRate`) |
| `search` | string  | —       | Free-text search                                                   |
| `view`   | string  | varies  | View mode (see per-endpoint)                                       |

| Method | Path             | Views               | Description                             |
| ------ | ---------------- | ------------------- | --------------------------------------- |
| `GET`  | `/api/prompts`   | `prompt` \| `topic` | Prompt list with mention/citation rates |
| `GET`  | `/api/pages`     | `page` \| `folder`  | Page list with SEO + citation metrics   |
| `GET`  | `/api/citations` | `url` \| `domain`   | Citation detail records                 |

## Reports

| Method | Path           | Description                      |
| ------ | -------------- | -------------------------------- |
| `GET`  | `/api/reports` | List saved report configurations |
| `POST` | `/api/reports` | Create a new report config       |

## Filters

| Method | Path                   | Description                                                 |
| ------ | ---------------------- | ----------------------------------------------------------- |
| `GET`  | `/api/filters/options` | Available platforms, topics, competitors, regions, personas |

## Audit (Free Audit Flow)

| Method | Path                          | Description                                                                                                                                                      |
| ------ | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/api/audit/generate-prompts` | Takes `{websiteUrl, brandName?}`, generates 10 prompts via Gemini, creates a **new free workspace** + prompts in DB. Returns `{workspaceId, brandName, prompts}` |
| `POST` | `/api/audit/run`              | Triggers analysis for a workspace (background). Body: `{workspaceId?}`. Returns `{status: "started"}`                                                            |
| `GET`  | `/api/audit/status`           | Check if audit is running. Returns `{running: boolean}`                                                                                                          |

## Analysis

| Method | Path                   | Description                                                      |
| ------ | ---------------------- | ---------------------------------------------------------------- |
| `POST` | `/api/analysis/run`    | Trigger analysis run (background). Returns `{status: "started"}` |
| `GET`  | `/api/analysis/status` | Check if analysis is running. Returns `{running: boolean}`       |

## Health

| Method | Path           | Description  |
| ------ | -------------- | ------------ |
| `GET`  | `/api/healthz` | Health check |
