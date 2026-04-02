# AI Engine (`lib/ai-engine`)

The core analysis engine that queries AI models with web search/grounding enabled, analyzes responses for brand visibility metrics, and stores results in PostgreSQL.

## How It Works

1. **Query**: Send each tracked prompt to 5 AI platforms with web search enabled
2. **Parse**: Extract brand/competitor mentions (programmatic) and citations (from API response metadata)
3. **Sentiment**: Score brand mentions via an LLM call (Gemini flash-lite, cheapest option)
4. **Store**: Write executions, mentions, and citations to the database
5. **Aggregate**: Roll up into `daily_metrics` for fast dashboard queries

All providers use **real-time web data** (grounded search), not just training data. This ensures results reflect current web content.

## File Structure

```
lib/ai-engine/src/
  index.ts              # Public exports
  types.ts              # Shared interfaces
  engine.ts             # Query orchestrator — parallel execution with rate limiting
  aggregator.ts         # Roll up into daily_metrics table
  scheduler.ts          # node-cron daily job (2 AM UTC)
  rate-limiter.ts       # Token-bucket rate limiter with concurrency control
  providers/
    openai.ts           # gpt-4o-mini + web_search_preview tool
    gemini.ts           # gemini-2.0-flash-lite + google_search_retrieval grounding
    perplexity.ts       # sonar model (web search built-in)
    claude.ts           # claude-haiku-4-5 + web_search tool
    dataforseo.ts       # Google AI Mode via DataForSEO SERP API
  analysis/
    mentions.ts         # Programmatic brand/competitor mention extraction
    citations.ts        # Citation URL classification
    sentiment.ts        # LLM-based sentiment scoring
```

## Provider Adapters

Each adapter implements the `ProviderAdapter` interface and auto-detects whether its API key is configured.

```ts
interface ProviderAdapter {
  name: string;
  isAvailable(): boolean;
  query(prompt: string): Promise<ProviderResponse>;
}
```

All adapters normalize responses into a common format:

```ts
interface ProviderResponse {
  platform: string; // "ChatGPT" | "Gemini" | "Perplexity" | "Claude" | "Google AI Mode"
  rawText: string; // Full AI response text
  citations: Array<{ url: string; domain: string; title?: string }>;
  executedAt: Date;
}
```

### Provider Details

| Provider          | Model                 | Web Search Method                            | Citation Extraction                                              |
| ----------------- | --------------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| **OpenAI**        | gpt-4o-mini           | `tools: [{type: "web_search_preview"}]`      | `output[].content[].annotations` where `type === "url_citation"` |
| **Google Gemini** | gemini-2.0-flash-lite | `tools: [{googleSearch: {}}]`                | `groundingMetadata.groundingChunks[].web.uri`                    |
| **Perplexity**    | sonar                 | Built-in (always searches)                   | `response.citations` array of URLs                               |
| **Anthropic**     | claude-haiku-4-5      | `tools: [{type: "web_search_20250305"}]`     | Text block citations + URL regex fallback                        |
| **DataForSEO**    | Google AI Mode        | POST `/v3/serp/google/ai_mode/live/advanced` | `items[].references[].{url, domain, title}`                      |

### Approximate Costs (per 1M tokens)

| Provider             | Input  | Output | Notes                  |
| -------------------- | ------ | ------ | ---------------------- |
| OpenAI (gpt-4o-mini) | $0.15  | $0.60  | + web search tool cost |
| Gemini (flash-lite)  | $0.075 | $0.30  | Cheapest option        |
| Perplexity (sonar)   | $1.00  | $1.00  | Search included        |
| Anthropic (haiku)    | $0.80  | $4.00  | + web search tool cost |
| DataForSEO           | —      | —      | ~$0.002 per request    |

## Analysis Pipeline

### Mentions (`analysis/mentions.ts`)

Programmatic extraction — no LLM call needed.

- Splits AI response into sentences
- Checks each sentence for brand/competitor name using word-boundary regex (`\bBrandName\b`)
- Returns position (1-indexed sentence where first mentioned) and brand identity
- Used to calculate mention rate: "did this response mention the brand?"

### Citations (`analysis/citations.ts`)

Programmatic classification — no LLM call needed.

- Takes the citations array from the provider response
- Classifies each domain: **Owned** (matches workspace URL), **Competitors** (matches competitor URLs), **Social** (reddit, linkedin, etc.), **Educational**, **News**, **Products** (default)
- Determines `hasBrandReference` and `competitorReferences`
- Returns enriched records ready for DB insertion

### Sentiment (`analysis/sentiment.ts`)

LLM call via Gemini flash-lite (cheapest model available).

- Only called when the brand is actually mentioned in a response (saves cost)
- Sends a structured prompt asking for `{score: 0-100, reasoning: "..."}`
- Score guide: 0=very negative, 50=neutral, 100=very positive
- Falls back to 50 (neutral) on parse failure or missing API key

## Concurrency & Rate Limiting

### Architecture

All 5 providers run **simultaneously**, each with its own rate limiter. Within each provider, prompts are processed concurrently up to the concurrency cap.

```
┌─ OpenAI (400 RPM, 20 concurrent) ────────────────┐
│  All prompts across all workspaces in parallel    │
│  Rate limiter gates requests to stay under limit  │
└───────────────────────────────────────────────────┘
┌─ Gemini (1500 RPM, 30 concurrent) ───────────────┐
│  (running simultaneously with OpenAI)             │
└───────────────────────────────────────────────────┘
┌─ Perplexity (40 RPM, 5 concurrent) ──────────────┐
│  (throttled more aggressively)                    │
└───────────────────────────────────────────────────┘
┌─ Claude (40 RPM, 5 concurrent) ──────────────────┐
└───────────────────────────────────────────────────┘
┌─ DataForSEO (1500 RPM, 30 concurrent) ───────────┐
└───────────────────────────────────────────────────┘
```

### Rate Limiter (`rate-limiter.ts`)

Token-bucket implementation with two controls:

- **RPM limit**: No more than N requests per rolling 60-second window
- **Concurrency limit**: No more than M requests in-flight at once

### Default Limits

| Provider         | Default RPM | Default Concurrency | 5,000 prompts takes |
| ---------------- | ----------- | ------------------- | ------------------- |
| OpenAI (ChatGPT) | 400         | 20                  | ~12.5 min           |
| Gemini           | 1,500       | 30                  | ~3.3 min            |
| Perplexity       | 40          | 5                   | ~125 min            |
| Claude           | 40          | 5                   | ~125 min            |
| DataForSEO       | 1,500       | 30                  | ~3.3 min            |

### Overriding Limits

Set environment variables to increase limits as you move to higher API tiers:

```bash
CHATGPT_RPM=1000
GEMINI_RPM=2000
PERPLEXITY_RPM=500
CLAUDE_RPM=500
GOOGLE_AI_MODE_RPM=2000
```

### Scaling Estimates (100 customers × 50 prompts = 5,000 prompts per provider)

| API Tier               | Bottleneck                  | Total Wall Clock |
| ---------------------- | --------------------------- | ---------------- |
| Base tier              | Perplexity/Claude at 40 RPM | ~125 min         |
| Mid tier (500 RPM all) | Even across providers       | ~10 min          |
| High tier (2000+ RPM)  | DB writes                   | ~5 min           |

Workspaces are processed in batches of 10 to control memory pressure.

## Scheduling

- **Automatic**: `node-cron` runs daily at 2:00 AM UTC (configured in `scheduler.ts`). Only processes **paid** workspaces — free audit workspaces are excluded from the daily cron.
- **Manual trigger**: `POST /api/analysis/run` — starts analysis in background, returns immediately. Can target any workspace (including free) via `{workspaceId}` in the body.
- **Free audit trigger**: `POST /api/audit/run` — same as above, used by the audit flow to run analysis for a newly created free workspace.
- **Status check**: `GET /api/analysis/status` — returns `{running: boolean}`
- A guard prevents concurrent runs (if already running, manual trigger returns 409)

## Data Flow

```
1. Cron fires at 2 AM UTC (or POST /api/analysis/run)

2. For each **paid** workspace (batches of 10; free workspaces skipped unless explicitly targeted by ID):
   a. Load all prompts from DB
   b. For each provider (all 5 in parallel):
      For each prompt (concurrent within rate limit):
        i.   Query provider with web search → ProviderResponse
        ii.  Store in prompt_executions (raw text, platform, timestamp)
        iii. Extract mentions programmatically → store in mentions table
        iv.  Classify citations programmatically → store in citations table
        v.   If brand mentioned → sentiment analysis via Gemini → store score

   c. Aggregate today's data into daily_metrics table
      (overall + per-platform + per-competitor breakdowns)

3. Frontend reads from daily_metrics + detail tables via API endpoints
```

## Environment Variables

```bash
# AI Provider API Keys (at least one required for analysis to run)
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AIza...           # Also used for sentiment analysis
PERPLEXITY_API_KEY=pplx-...
ANTHROPIC_API_KEY=sk-ant-...
DATAFORSEO_LOGIN=your-email
DATAFORSEO_PASSWORD=your-password

# Optional: Rate limit overrides
CHATGPT_RPM=400
GEMINI_RPM=1500
PERPLEXITY_RPM=40
CLAUDE_RPM=40
GOOGLE_AI_MODE_RPM=1500
```

Providers with missing API keys are automatically skipped — the engine only uses what's configured.
