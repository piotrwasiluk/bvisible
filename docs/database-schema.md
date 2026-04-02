# Database Schema

PostgreSQL via Drizzle ORM. Schema files in `lib/db/src/schema/`.

## Tables

### Core

| Table         | File            | Purpose                                                                                   |
| ------------- | --------------- | ----------------------------------------------------------------------------------------- |
| `workspaces`  | `workspace.ts`  | Brand config: name, website URL, up to 3 competitor URLs, region, type (`paid` \| `free`) |
| `websites`    | `website.ts`    | Additional websites linked to a workspace                                                 |
| `competitors` | `competitor.ts` | Competitor URLs (separate from the 3 in workspace)                                        |
| `users`       | `user.ts`       | User accounts with workspace association and roles                                        |

### Prompts & Execution

| Table               | File                  | Purpose                                                                |
| ------------------- | --------------------- | ---------------------------------------------------------------------- |
| `topics`            | `topic.ts`            | Topic clusters for organizing prompts (e.g., "Machine Monitoring")     |
| `prompts`           | `prompt.ts`           | Tracked AI prompts with topic, tags, type, fanout count, search volume |
| `prompt_executions` | `prompt-execution.ts` | Individual AI model responses — one row per (prompt × platform × run)  |

### Analysis Results

| Table              | File                 | Purpose                                                    |
| ------------------ | -------------------- | ---------------------------------------------------------- |
| `mentions`         | `mention.ts`         | Brand/competitor mentions extracted from AI responses      |
| `citations`        | `citation.ts`        | URLs cited in AI responses with domain type classification |
| `sentiment_themes` | `sentiment-theme.ts` | Aggregated sentiment themes with scores and example quotes |

### Pages & Reporting

| Table           | File              | Purpose                                                        |
| --------------- | ----------------- | -------------------------------------------------------------- |
| `pages`         | `page.ts`         | Brand's tracked URLs with SEO metrics + AI citation data       |
| `reports`       | `report.ts`       | Saved report configurations (name, schedule, format, sections) |
| `daily_metrics` | `daily-metric.ts` | Pre-aggregated daily metrics for fast dashboard queries        |

## Key Relationships

```
workspace (1) ──→ (N) topics
workspace (1) ──→ (N) prompts
prompt    (1) ──→ (N) prompt_executions
execution (1) ──→ (N) mentions
execution (1) ──→ (N) citations
workspace (1) ──→ (N) daily_metrics
workspace (1) ──→ (N) pages
workspace (1) ──→ (N) sentiment_themes
workspace (1) ──→ (N) reports
```

All child tables cascade delete when the parent workspace is deleted.

## Workspace Types

The `workspaces.type` column (`text`, default `"paid"`) distinguishes workspace tiers:

| Type   | Created By                         | Daily Cron | Description                                       |
| ------ | ---------------------------------- | ---------- | ------------------------------------------------- |
| `paid` | `POST /api/workspace` or setup     | Yes        | Customer workspaces, updated daily at 2 AM UTC    |
| `free` | `POST /api/audit/generate-prompts` | No         | One-off free audit workspaces, not auto-refreshed |

Each free audit creates a **new** workspace (not a singleton). All API data routes accept a `workspaceId` query param to scope queries; when omitted, the first paid workspace is used as default.

## `daily_metrics` Dimensions

The `daily_metrics` table stores pre-aggregated data with nullable dimension columns. Rows with `null` dimensions represent totals.

| platform  | topic                | competitor | Meaning                             |
| --------- | -------------------- | ---------- | ----------------------------------- |
| null      | null                 | null       | Overall metrics for the day         |
| "ChatGPT" | null                 | null       | Metrics for ChatGPT only            |
| null      | null                 | "Vorne"    | Competitor's mention rate vs. total |
| null      | "Machine Monitoring" | null       | Metrics for a specific topic        |

Metrics per row: `mention_rate`, `share_of_voice`, `citation_rate`, `citation_share`, `avg_position`, `sentiment_score`, `total_mentions`, `total_citations`, `total_executions`.

## Citation Domain Types

The `citations.domain_type` column classifies cited URLs:

| Type          | Meaning                                  |
| ------------- | ---------------------------------------- |
| `Owned`       | Brand's own domain                       |
| `Competitors` | A competitor's domain                    |
| `Social`      | reddit, linkedin, youtube, twitter, etc. |
| `Educational` | wikipedia, .edu domains, arxiv, etc.     |
| `News`        | reuters, bbc, techcrunch, etc.           |
| `Products`    | Default — third-party product/tool sites |
