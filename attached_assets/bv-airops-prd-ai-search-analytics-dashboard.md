# PRD: AI Search Analytics Dashboard

| Property                | Value                                                 |
| ----------------------- | ----------------------------------------------------- |
| **Status**              | Draft v1                                              |
| **Date**                | March 29, 2026                                        |
| **Reference Platforms** | AirOps, Profound (tryprofound.com), Peec AI (peec.ai) |
| **Scope**               | Full analytics dashboard for AI search visibility     |

---

## Document Purpose

This PRD defines every page, component, and data module required for an AI Search Analytics Dashboard. It is based on a detailed visual audit of AirOps' analytics module (13 screenshots covering Overview, Visibility, Citations, Community, Sentiment, Pages, Prompts, and Citations detail screens), competitive research on Profound and Peec AI, and best practices emerging in the AEO (Answer Engine Optimization) category.

The **Reports** tab and **Opportunities** page (off-site content ranking potential) have not yet been screenshotted. These pages are spec'd below based on competitive intelligence and logical extension of the platform.

---

## 1. Global Architecture

### 1.1 Navigation Structure

The dashboard consists of **8 primary tabs** accessible via a top-level horizontal navigation bar:

| #   | Tab / Screen            | Based On                  | Priority | Status              |
| --- | ----------------------- | ------------------------- | -------- | ------------------- |
| 1   | Overview                | AirOps (screenshot 1)     | P0       | Screenshotted       |
| 2   | Visibility              | AirOps (screenshots 2–4)  | P0       | Screenshotted       |
| 3   | Citations (Analytics)   | AirOps (screenshots 5–7)  | P0       | Screenshotted       |
| 4   | Community               | AirOps (screenshot 8)     | P1       | Screenshotted       |
| 5   | Sentiment               | AirOps (screenshots 9–10) | P0       | Screenshotted       |
| 6   | Pages                   | AirOps (screenshot 11)    | P0       | Screenshotted       |
| 7   | Prompts                 | AirOps (screenshot 12)    | P0       | Screenshotted       |
| 8   | Citations (Detail View) | AirOps (screenshot 13)    | P0       | Screenshotted       |
| 9   | Opportunities           | AirOps + Profound         | P1       | Awaiting screenshot |
| 10  | Reports                 | AirOps                    | P1       | Awaiting screenshot |

**Note:** "Citations" exists as two distinct screens in AirOps — the **Analytics** view (inside the Analytics module with charts/trends, sections 4.x below) and the **Detail View** (a standalone data table of every cited URL with metadata, section 9 below). Similarly, **Pages** and **Prompts** are standalone screens outside the Analytics tab structure, each with their own filter bars.

### 1.2 Global Filters (Persistent Across All Tabs)

A persistent filter bar sits directly below the tab navigation and applies to all views. Observed in every AirOps screenshot:

| Filter               | Type                     | Notes                                                                                                                                                                  |
| -------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Date Range**       | Date picker with presets | Default: last 7 days. Presets: 7d, 14d, 30d, 90d, custom range. AirOps shows "Mar 22 – Mar 28"                                                                         |
| **Region / Country** | Dropdown (multi-select)  | ISO country codes. AirOps shows "United States". Peec supports multi-region tracking per project                                                                       |
| **Prompt Type**      | Dropdown                 | AirOps shows "Category Related" with an × to remove. Other types likely include: Brand, Product, Comparison, Informational                                             |
| **AI Platform**      | Dropdown (multi-select)  | ChatGPT, Gemini, Perplexity, Google AI Mode, Google AI Overview, Claude, Grok, DeepSeek. Peec charges add-ons per extra platform beyond core 3 — consider bundling all |
| **Topic**            | Dropdown (multi-select)  | User-configured topic clusters                                                                                                                                         |
| **Persona**          | Dropdown (multi-select)  | Audience segments / buyer personas. Profound offers this on Enterprise tier                                                                                            |
| **Competitor**       | Dropdown (multi-select)  | Filter to specific competitor subset                                                                                                                                   |

**Additional global header elements:**

- **Answer Count Badge** (top-right) — Total tracked AI answers in the period (AirOps shows "6,751 answers" with a trend icon)
- **Insights Settings** gear icon (top-right) — Configure brand, competitors, topics, personas, regions
- **"Add Filter" button** — Allows combining custom filter dimensions
- **"Clear Filters" link** — Resets all active filters

---

## 2. Page 1 — Overview

**Purpose:** Executive snapshot of brand health across all AI search dimensions in a single, non-scrollable (ideally) view. This is the landing page when a user opens Analytics.

### 2.1 KPI Summary Cards (Top Row)

Five metric cards displayed horizontally across the full width. Each card shows:

- Metric label + info tooltip icon (ⓘ)
- Large current value
- Period-over-period change with directional arrow and color coding (green ↗ = improvement, red/orange ↘ = decline)

| Card             | Metric                    | Format        | Description                                                                 |
| ---------------- | ------------------------- | ------------- | --------------------------------------------------------------------------- |
| Mention Rate     | Percentage                | 7.1% ↗ 3.1%   | How often the brand is mentioned in AI responses out of all tracked prompts |
| Share of Voice   | Percentage                | 46.6% ↗ 16.3% | Brand's share of total mentions relative to tracked competitors             |
| Citation Rate    | Percentage                | 18.8% ↗ 11.3% | How often the brand's URLs/domain are cited as sources in AI responses      |
| Sentiment Score  | 0–100 integer             | 92 ↘ -8       | Aggregate sentiment score across all captured brand mentions                |
| Average Position | Decimal (1 decimal place) | 1.2 ↘ -0.1    | Average rank position when brand is mentioned (lower = better)              |

### 2.2 Mention Rate by Platform (Bottom-Left Panel)

**Component:** Horizontal bar chart

- One bar per AI platform, sorted by mention rate descending
- Platform icon + name on left, percentage value on right
- Bar length proportional to value
- Dropdown toggle in header to switch metric: Mention Rate / Share of Voice / Citation Rate

**Platforms observed in AirOps:**

| Platform           | Icon | Mention Rate |
| ------------------ | ---- | ------------ |
| Google AI Mode     | 🔍   | 21.3%        |
| Google AI Overview | 🔍   | 7.5%         |
| Gemini             | ✦    | 4.0%         |
| ChatGPT            | ⊙    | 1.6%         |
| Perplexity         | ⚙    | (below fold) |

**Platforms to add (from Profound/Peec coverage):** Claude, Grok, DeepSeek, Meta AI, Amazon Rufus

### 2.3 Mention Rate by Competitor (Bottom-Right Panel)

**Component:** Competitive leaderboard widget

- **Rank badge** at top: large ordinal number (e.g., "1st") with change indicator (e.g., "+2" in green)
- **Dropdown toggle** in header to switch metric: Mention Rate / Share of Voice / etc.
- **Ranked table** with columns: Rank #, Brand icon, Brand name, Metric %, Period change %
- Brand's own row highlighted with "You" tag in a distinct color
- Change values color-coded: green = positive, red = negative
- Scrollable/expandable if >4 competitors

**Data observed in AirOps:**

| Rank | Brand            | Mention Rate | Change |
| ---- | ---------------- | ------------ | ------ |
| 1    | Guidewheel (You) | 7.1%         | +3.1%  |
| 2    | Machine Metrics  | 6.3%         | -0.1%  |
| 3    | Vorne            | 4.2%         | -0.3%  |
| 4    | Augury           | 1.4%         | +0.0%  |

---

## 3. Page 2 — Visibility

**Purpose:** Deep dive into brand visibility metrics over time, across platforms, topics, and vs. competitors. This is the most data-dense page. In AirOps it spans 3 full screenshots of scrollable content.

### 3.1 KPI Summary Cards (Top Row)

Three cards (subset of Overview, focused on visibility):

| Card             | Metric        | Format           |
| ---------------- | ------------- | ---------------- |
| Mention Rate     | 7.1% ↗ 3.1%   | Same as Overview |
| Share of Voice   | 46.6% ↗ 16.3% | Same as Overview |
| Average Position | 1.2 ↘ -0.1    | Same as Overview |

### 3.2 Mention Rate Section (Two-Column Layout)

**Left Column: Mention Rate Time Series**

- **Chart type:** Line chart with data labels on each point
- **X-axis:** Dates across selected period (daily granularity)
- **Y-axis:** Mention rate %
- **Dropdown toggle:** "Overall" (default) / individual platform breakdown
- **Legend:** Brand name with color indicator
- **Data observed:** 7.3% → 7.0% → 7.8% → 7.5% → 5.8% → 6.7% → 7.8% (Mar 22–28)

**Right Column: Competitor Mention Rate Leaderboard**

- Same leaderboard widget as Overview section 2.3
- Rank badge with change, table of brands + mention rates + changes

### 3.3 Share of Voice Section (Two-Column Layout)

**Left Column: Share of Voice Time Series**

- Same line chart format as 3.2
- **Data observed:** 49.6% → 47.2% → 46.9% → 47.4% → 39.7% → 44.5% → 51.0% (Mar 22–28)

**Right Column: Competitor Share of Voice Leaderboard**

| Rank | Brand            | SoV   | Change |
| ---- | ---------------- | ----- | ------ |
| 1    | Guidewheel (You) | 46.6% | +16.3% |
| 2    | Machine Metrics  | 41.4% | -6.9%  |
| 3    | Vorne            | 27.2% | -5.9%  |
| 4    | Augury           | 8.8%  | -1.4%  |

### 3.4 Average Position Section (Two-Column Layout)

**Left Column: Average Position Time Series**

- Line chart, Y-axis shows position values (lower = better, consider inverting Y-axis so 1 is at top)
- **Data observed:** 1.2 → 1.1 → 1.2 → 1.2 → 1.1 → 1.3 → 1.2 (Mar 22–28)

**Right Column: Competitor Position Leaderboard**

| Rank | Brand                | Avg Position | Change |
| ---- | -------------------- | ------------ | ------ |
| 1    | Guidewheel (You)     | 1.2          | -0.1   |
| 2    | Machine Metrics      | 1.3          | +0.0   |
| 3    | Asset Watch          | 1.4          | -0.1   |
| 4    | Inductive Automation | 1.4          | +0.2   |

### 3.5 Mention Rate by Topic (Full-Width Panel)

**Component:** Horizontal scale visualization per topic

- **Rows:** Topic names (user-configured topic clusters)
- **Columns / Scale:** 0%–100% axis
- **Visual:** Brand icons (yours + competitors) positioned along the scale based on their mention rate for that topic
- Hoverable for exact values

**Topics observed in AirOps:**

- Automation, IIoT & AI Platforms
- Energy & Cost Analytics
- Frontline Execution & Coaching
- Lean Waste & Continuous Improvement
- Machine & Downtime Monitoring

### 3.6 Mention Rate by Platform × Brand (Heatmap Table)

**Component:** Matrix heatmap

- **Rows:** Brands (your brand + competitors)
- **Columns:** AI Platforms (ChatGPT, Gemini, Perplexity, Google AI Mode, Google AI Overview)
- **Cell values:** Mention rate % with color intensity gradient (darker blue = higher %)
- Instantly shows which platforms favor which brands

**Data observed in AirOps (partial):**

| Brand            | ChatGPT | Gemini | Perplexity | Google AI Mode | Google AI Overview |
| ---------------- | ------- | ------ | ---------- | -------------- | ------------------ |
| Guidewheel (You) | 1.6%    | 4.0%   | 1.3%       | 21.3%          | 7.5%               |
| Machine Metrics  | 5.9%    | 6.1%   | 2.4%       | 10.5%          | 6.7%               |
| Vorne            | 0.3%    | 4.2%   | 0.5%       | 10.4%          | 5.3%               |

---

## 4. Page 3 — Citations

**Purpose:** Understand which URLs, domains, and content types are being cited by AI engines when responding to relevant prompts. This page answers: "What sources are AI models using, and how often is our content among them?"

### 4.1 Upsell / Feature Banner (Optional)

AirOps shows a promotional banner at the top: "Offsite: Turn insights into placements — AirOps handles outreach, negotiation, and placement, so citations actually move the needle on your visibility." with a "Talk to our team" CTA. Consider whether a similar placement optimization upsell belongs here.

### 4.2 KPI Summary Cards (Top Row)

Three cards:

| Card              | Metric     | Format        | Description                                                   |
| ----------------- | ---------- | ------------- | ------------------------------------------------------------- |
| Citation Rate     | Percentage | 18.8% ↗ 11.3% | How often brand's domain is cited as a source in AI responses |
| Citation Share    | Percentage | 2.9% ↗ 1.7%   | Brand's share of total citations across all sources           |
| Citations (Count) | Integer    | 1,789 ↗ 128   | Absolute count of citations in the period                     |

### 4.3 Domain Category Breakdown (Full-Width Bar)

**Component:** Horizontal stacked bar (100% width)

Shows the type of domains being cited in AI answers across the category:

| Category           | Share | Color               |
| ------------------ | ----- | ------------------- |
| Products           | 52%   | Teal/Green          |
| Social             | 8%    | Pink                |
| Educational        | 6%    | Green               |
| +4 more categories | 28%   | Gray / other colors |

Useful for understanding the source ecosystem: are AI models citing product pages, social discussions, educational content, news, etc.?

### 4.4 Citation Rate Time Series (Two-Column Section)

**Left Column: Citation Rate Over Time**

- Line chart, daily granularity
- **Data observed:** 18.3% → 18.3% → 17.5% → 20.4% → 18.2% → 19.1% → 20.4% (Mar 22–28)
- Dropdown: "Overall" / per-platform

### 4.5 Citation Rate by Domain (Left Panel)

**Component:** Multi-line time series chart

- Multiple lines, one per top-cited domain
- Legend at bottom with domain names and color indicators

**Domains observed in AirOps:**

- reddit.com (blue)
- linkedin.com (light blue)
- tractian.com (purple)
- youtube.com (red)
- guidewheel.com (green)

Shows how different domain sources trend over time in AI citations.

### 4.6 Citation Rate by Competitors (Right Panel)

**Component:** Multi-line time series chart

- One line per competitor's domain
- Shows whose content is getting cited more/less over time

**Domains observed:**

- inductiveautomation.com
- assetwatch.com
- machinemetrics.com
- vorne.com
- guidewheel.com

### 4.7 Top 10 Cited Domains (Bottom-Left Table)

**Component:** Ranked table

| Column               | Description              |
| -------------------- | ------------------------ |
| Rank #               | Position                 |
| Domain               | Domain name with favicon |
| % of Total Citations | Share of all citations   |
| Citations            | Absolute count           |

**Data observed:**

| #   | Domain        | % of Total | Citations |
| --- | ------------- | ---------- | --------- |
| 1   | YouTube       | 5.1%       | 3,140     |
| 2   | Guidewheel    | 2.9%       | 1,789     |
| 3   | LinkedIn Jobs | 2.7%       | 1,645     |
| 4   | Tractian      | 2.5%       | 1,529     |
| 5   | Reddit        | 2.4%       | 1,473     |

### 4.8 Top 10 Cited URLs (Bottom-Right Table)

**Component:** Ranked table with full URL paths

| Column               | Description                                   |
| -------------------- | --------------------------------------------- |
| Rank #               | Position                                      |
| URL                  | Full URL path (truncated with hover for full) |
| % of Total Citations | Share                                         |
| Citations            | Absolute count                                |

**Data observed:**

| #   | URL                                                 | %    | Citations |
| --- | --------------------------------------------------- | ---- | --------- |
| 1   | guidewheel.com/blog/machine-downtime-monitoring     | 0.7% | 412       |
| 2   | tractian.com/en/blog/machine-downtime-tracking      | 0.5% | 307       |
| 3   | getmaintainx.com/blog/downtime-tracking             | 0.5% | 303       |
| 4   | guidewheel.com/blog/automated-downtime-tracking     | 0.5% | 292       |
| 5   | guidewheel.com/blog/predictive-maintenance-roi-2026 | 0.4% | 260       |

### 4.9 Topic Citation Rate by Platform (Heatmap Table)

**Component:** Matrix heatmap (same style as Visibility section 3.6)

- **Rows:** Topics
- **Columns:** AI Platforms
- **Cell values:** Citation rate % with color intensity
- **Dropdown toggle:** "Topic" view (default) — may also support "Domain" or "Brand" view

**Data observed:**

| Topic                        | Perplexity | Google AI Overview | Google AI Mode | Gemini | ChatGPT |
| ---------------------------- | ---------- | ------------------ | -------------- | ------ | ------- |
| OT-Free Connectivity & ...   | 39.4%      | 39.1%              | 38.1%          | 17.3%  | 6.6%    |
| Machine & Downtime M...      | 38.4%      | 32.9%              | 31.2%          | 18.8%  | 12.0%   |
| Multi-Plant Standardizati... | 39.7%      | 33.6%              | 26.4%          | 8.5%   | 3.6%    |
| Lean Waste & Continuou...    | 24.8%      | 23.2%              | 22.0%          | 20.0%  | 7.9%    |
| Automation, IIoT & AI Pl...  | 24.8%      | 23.5%              | 19.2%          | 10.3%  | 5.5%    |

---

## 5. Page 4 — Community

**Purpose:** Track brand presence within community/social platforms that AI models frequently cite — primarily Reddit. Reddit discussions are increasingly used as training and citation sources by AI engines, making community visibility a distinct analytics dimension.

### 5.1 KPI Summary Cards (Top Row)

Two cards:

| Card                 | Metric     | Format       | Description                                                                |
| -------------------- | ---------- | ------------ | -------------------------------------------------------------------------- |
| Reddit Citation Rate | Percentage | 16.7% ↗ 1.1% | How often Reddit is cited as a source in AI responses for relevant prompts |
| Reddit Citations     | Integer    | 1,473 ↗ 0    | Absolute count of Reddit citations in period                               |

### 5.2 Citation Rate by Subreddit (Left Panel)

**Component:** Horizontal bar chart

- Bars show citation rate per subreddit
- Sorted descending

**Data observed:**

| Subreddit           | Citation Rate |
| ------------------- | ------------- |
| (top, name cut off) | 0.9%          |
| /r/homelab          | 0.7%          |
| /r/networking       | 0.5%          |
| /r/devops           | 0.4%          |
| /r/IOT              | 0.3%          |

### 5.3 Top Reddit URLs (Right Panel)

**Component:** Ranked table

| Column    | Description                         |
| --------- | ----------------------------------- |
| Rank #    | Position                            |
| URL       | Full Reddit thread URL              |
| Citations | Count                               |
| Change    | Period-over-period change % (green) |

**Data observed:**

| #   | URL (abbreviated)                                                | Citations | Change |
| --- | ---------------------------------------------------------------- | --------- | ------ |
| 1   | /r/PLC/.../downtime_tracking_how_do_you_do_it/                   | 50        | +59%   |
| 2   | /r/PLC/.../how_to_acquire_machine_data_for_oee_without/          | 36        | +22%   |
| 3   | /r/arduino/.../current_sensor_value_fluctuating_oddly/           | 33        | +31%   |
| 4   | /r/AskEngineers/.../how*can_i_measure_energy_per_machine_in*...  | 29        | +39%   |
| 5   | /r/LeanManufacturing/.../from*a_lean_perspective_do_you_find*... | 22        | +28%   |

### 5.4 Subreddit Citation Rate (Full-Width, Below)

**Component:** Additional breakdown panel (partially visible in screenshot)

- Described as "How often the top subreddits are cited in AI responses"
- Likely a more detailed time-series or expanded table view of subreddit citation trends

### 5.5 Future Consideration: Expand Beyond Reddit

Profound and other tools also track LinkedIn, YouTube, and forum citations. Consider expanding this page into a broader "Community & Social" page that includes:

- Reddit (primary)
- LinkedIn discussion citations
- YouTube video citations
- Forum/Q&A site citations (Stack Overflow, Quora, industry forums)
- GitHub citations (for technical brands)

---

## 6. Page 5 — Sentiment

**Purpose:** Understand how AI models characterize and describe the brand — what themes and attributes they associate with it, and whether the overall tone is positive, negative, or neutral.

### 6.1 Sentiment Score Over Time (Full-Width Chart)

**Component:** Line chart

- **Y-axis:** Sentiment score 0–100 (higher = more positive)
- **X-axis:** Dates across selected period
- **Dotted reference lines** at 25, 50, 75, 100
- **Dropdown:** "Overall Score" (default) — may also support per-platform or per-topic views
- **Description text:** "Your aggregate sentiment score across all captured brand mentions. Higher scores mean more positive sentiment."

**Data observed:** Score stays high around 95–100 from Mar 22–25, then gradually declines toward ~85 by Mar 27–28

### 6.2 Themes Table (Full-Width Panel)

**Component:** Sortable data table

- **Description:** "Top sentiment drivers, based on themes in answers."
- **Dropdown filter:** "All Sentiment" (default) / Positive / Negative

| Column           | Description                                                        |
| ---------------- | ------------------------------------------------------------------ |
| Theme            | Extracted theme/topic keyword                                      |
| Sentiment Score  | Score for this theme (0–100, color-coded: green = high, red = low) |
| Volume           | % of total mentions that reference this theme                      |
| Occurrences      | Absolute count of times this theme appears                         |
| Expand (chevron) | Click to see example AI responses containing this theme            |

**Data observed:**

| Theme                     | Sentiment Score | Volume | Occurrences |
| ------------------------- | --------------- | ------ | ----------- |
| non-invasive installation | 100 (green)     | 21.8%  | 178         |
| rapid deployment          | 99.2 (green)    | 14.7%  | 120         |

### 6.3 Sentiment Chart — Treemap (Full-Width Panel)

**Component:** Treemap visualization

- **Tile size** = frequency/occurrences (larger tile = more common theme)
- **Tile color** = net sentiment (green = positive, red/coral = negative)
- Each tile shows: theme name + occurrence count
- **Dropdown:** "All Sentiments" (default) / Positive only / Negative only

**Data observed (positive themes — green tiles):**

| Theme                        | Occurrences |
| ---------------------------- | ----------- |
| non-invasive installation    | 178         |
| rapid deployment             | 120         |
| legacy machine compatibility | 105         |
| minimal IT burden            | 61          |
| real-time visibility         | 45          |
| cost effectiveness           | 41          |
| micro-stop detection         | 31          |
| OEE performance tracking     | 22          |
| fast time-to-value           | 19          |
| operator empowerment         | 14          |
| ai-driven insights           | 13          |

**Data observed (negative themes — red/coral tiles):**

| Theme                 | Occurrences |
| --------------------- | ----------- |
| unplanned downtime... | 12          |
| no machine control    | 11          |
| limited data depth    | 10          |

This treemap is extremely valuable for product marketing — it shows exactly how AI models are positioning the brand and which attributes they emphasize.

---

## 7. Screen — Prompts

**Purpose:** Manage, analyze, and explore the prompts/questions being tracked across AI platforms. This is the operational core of the system — all visibility, citation, and sentiment data derives from prompt execution. This is a **standalone screen** (not inside the Analytics tabs) with its own filter bar.

### 7.1 Header & Filters

- **Page title:** "Prompts"
- **Filters:** Date range (Mar 22 – Mar 28), Region (United States), Filter button
- **Insights Settings** link (top-right)

### 7.2 View Toggle & Actions Bar

- **View toggle tabs:** "Prompt" (default list view) | "Topic" (grouped by topic view)
- **Search bar:** Free text search across prompt text
- **Actions (top-right):**
  - Refresh/sync icon
  - "✏ Edit Topics" button — manage topic taxonomy
  - "+ Add Prompts" button (primary CTA, dark/filled) — add new prompts to tracking

### 7.3 Prompt List Table

**Component:** Sortable, searchable data table with checkbox selection column

| Column        | Type                | Description                                                                                                                                                 |
| ------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ☐ (Checkbox)  | Selection           | Bulk select for actions                                                                                                                                     |
| Prompt        | Text (multi-line)   | Full conversational prompt text. These are natural-language questions, not keywords. e.g., "How do I monitor machine uptime without connecting to the PLC?" |
| Topic         | Tag with color dot  | Assigned topic cluster. Color-coded dot matches topic taxonomy. e.g., "● Automation, IIoT & AI Platforms"                                                   |
| Tags          | Colored dot cluster | Multi-tag indicator showing assigned tags (displayed as colored dots with count, e.g., "●●● 3 tags"). Color variety indicates different tag categories      |
| Query Fanouts | Icon + number       | Number of query variations/fanouts generated from this prompt. Shown with a funnel/filter icon (🔻). e.g., "🔻 10", "🔻 14"                                 |
| Prompt Type   | Tag with color dot  | Classification of the prompt. e.g., "● Category Related". Other types likely include: Brand, Product, Comparison                                            |
| Prompt Volume | Mini bar chart icon | Estimated real-world search volume indicator. Displayed as a small bar chart icon (📊) — likely clickable for detail                                        |
| Mention Rate  | Percentage + change | Brand mention rate for this specific prompt. Shows current % and period change in green (positive) or red (negative). e.g., "20.0% +8.6%"                   |
| Citation Rate | Percentage + change | Brand citation rate for this specific prompt. Shows current % and period change. e.g., "54.3% +28.6%"                                                       |

**Data observed (sample rows):**

| Prompt                                                                     | Topic                           | Fanouts | Type             | Mention Rate | Citation Rate |
| -------------------------------------------------------------------------- | ------------------------------- | ------- | ---------------- | ------------ | ------------- |
| What's the difference between an IIoT platform and an MES?                 | Automation, IIoT & AI Platforms | 10      | Category Related | 0.0% 0.0%    | 0.0% 0.0%     |
| How do I monitor machine uptime without connecting to the PLC?             | Automation, IIoT & AI Platforms | 14      | Category Related | 20.0% +8.6%  | 54.3% +28.6%  |
| What's the best way to roll out machine monitoring across multiple plants? | Automation, IIoT & AI Platforms | 10      | Category Related | 5.7% +2.9%   | 25.7% +5.7%   |
| What's the best tool to track downtime automatically on older machines?    | Automation, IIoT & AI Platforms | 10      | Category Related | 37.1% +17.1% | 62.9% +42.9%  |
| Why is my current sensor data showing the machine running when it's idle?  | Automation, IIoT & AI Platforms | 8       | Category Related | 0.0% 0.0%    | 2.9% +2.9%    |
| How do I set up automatic run/stop detection from motor current?           | Automation, IIoT & AI Platforms | 11      | Category Related | 0.0% 0.0%    | 0.0% 0.0%     |
| What's better: edge processing or cloud processing for shop floor data?    | Automation, IIoT & AI Platforms | 12      | Category Related | 0.0% 0.0%    | 0.0% 0.0%     |
| How can I get real-time OEE without manual operator input?                 | Automation, IIoT & AI Platforms | 13      | Category Related | 5.7% -2.9%   | 2.9% 0.0%     |
| What's the best practice for tagging downtime reasons on the floor?        | Automation, IIoT & AI Platforms | 13      | Category Related | 0.0% 0.0%    | 17.1% +14.3%  |
| How do I integrate machine monitoring data with our ERP?                   | Automation, IIoT & AI Platforms | 14      | Category Related | 0.0% 0.0%    | 0.0% 0.0%     |
| Which vendor is best for plug-and-play machine monitoring with no IT?      | Automation, IIoT & AI Platforms | 14      | Category Related | 28.6% +8.6%  | 5.7% +5.7%    |

### 7.4 Key Observations from Screenshot

- **Prompts are conversational questions**, not keywords — they mirror how real users ask AI platforms
- **Query Fanouts** is a notable feature: each prompt generates multiple variations (8–14 fanouts observed), likely to capture response variability across rephrased versions
- **Prompt Volume** is shown as a mini-chart icon — this may connect to real-world volume data (similar to Profound's Prompt Volumes feature)
- **Tags system** allows multi-tagging prompts with colored categories beyond just Topic and Type
- **Mention Rate and Citation Rate are independent** — a prompt can have high citations but low mentions (brand's URL is cited but brand name isn't mentioned directly), which is a valuable distinction

### 7.5 Prompt Detail View (Drill-Down — Not Yet Screenshotted)

When clicking a prompt row, show an expanded detail view:

- **Prompt text** (full)
- **Response preview** per platform — show the actual AI response (or a summary) for the most recent execution
- **Mention / Citation / Position / Sentiment** per platform as a mini-comparison table
- **Trend chart** — how this prompt's metrics have changed over time
- **Sources cited** — which URLs the AI cited in its response
- **Competitors mentioned** — which competitors appeared in the response
- **Fanout variations** — list of all generated query variations and their individual results

### 7.6 Prompt Volumes / Discovery (Profound-Inspired Feature)

Profound's signature differentiator is **Prompt Volumes** — a dataset of real prompts submitted by actual users to AI platforms, with estimated search volume. Consider including:

- **Keyword search** — type a keyword and see related real-user prompts with volume estimates
- **Volume by AI platform** — estimated prompt frequency on ChatGPT vs. Gemini vs. Perplexity vs. Claude
- **Intent classification** — Information / Consideration / Conversation / Generation
- **Trending prompts** — prompts gaining volume in your category
- **Add to tracking** — one-click add a discovered prompt to your active tracking set

### 7.7 Prompt Suggestions (Peec-Inspired Feature)

Peec auto-suggests prompts based on website content analysis:

- Scan brand's website and automatically generate relevant conversational prompts
- Suggestions organized by funnel stage: Awareness → Consideration → Decision
- One-click approve and add to tracking

---

## 8. Screen — Pages

**Purpose:** URL-level performance analytics that bridges traditional SEO metrics (clicks, impressions, position, CTR from Google Search Console) with AI search metrics (citations, citation rate). This is a **standalone screen** that shows which specific pages on the brand's website are performing — both in traditional search and in AI engines. This is critical for content strategy: which pages are getting picked up by AI, and which are not?

### 8.1 Header & Filters

- **Page title:** "Pages"
- **Filter bar:** "Smart Filters" button (green, prominent), Date range (Mar 22 – Mar 28), Region (United States), Filter button
- **Insights Settings** link (top-right)

**Note:** "Smart Filters" appears to be a distinct feature here — likely pre-built filter presets for common views (e.g., "High citations, low clicks", "Declining pages", "New citations this week").

### 8.2 View Toggle & Actions

- **View toggle tabs:** "Page" (default, individual URL view) | "Folder" (grouped by site section/directory)
- **Search bar:** Free text search across URLs
- **"Upload Sitemap" button** (top-right) — import XML sitemap to populate the page list automatically

### 8.3 Pages Data Table

**Component:** Sortable data table with checkbox selection, combining GSC + AI citation data

| Column              | Type                | Description                                                                                                                      |
| ------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| ☐ (Checkbox)        | Selection           | Bulk select for actions                                                                                                          |
| Page                | URL (truncated)     | Full URL path of the page. Truncated with hover for full URL. e.g., "https://www.guidewheel.com/blog/machine-downtime-monito..." |
| Folder              | Folder icon + name  | Site section the URL belongs to. e.g., "📁 blog", "📁 solutions". Based on URL path or manually assigned                         |
| Primary Keyword     | Text                | The main keyword this page targets/ranks for. e.g., "machine downtime tracking", "predictive maintenance roi"                    |
| Clicks              | Integer + change %  | GSC clicks in the period. Change shown in green (positive) or red (negative). e.g., "1 +100%", "0 -100%"                         |
| Impressions         | Integer + change %  | GSC impressions in the period. e.g., "566 +216%", "1K +88%"                                                                      |
| Position            | Decimal + change %  | GSC average position. e.g., "8.6 +2%", "4.2 -15%" (note: for position, negative change = improvement)                            |
| CTR                 | Percentage + change | GSC click-through rate. e.g., "0.18% 0%", "0.00% -1%"                                                                            |
| Citations           | Integer + change %  | AI citation count for this URL across all platforms. e.g., "419 +598%", "305 +355%"                                              |
| Citation Rate       | Percentage + change | How often this URL is cited in AI responses. e.g., "4.54% +4%", "4.18% +3%"                                                      |
| Prom... (truncated) | Unknown             | Column partially cut off — likely "Prominence" or "Prompt Coverage"                                                              |

**Data observed (top rows):**

| Page (abbreviated)                   | Folder    | Primary Keyword                 | Clicks  | Impressions | Position  | CTR       | Citations | Citation Rate |
| ------------------------------------ | --------- | ------------------------------- | ------- | ----------- | --------- | --------- | --------- | ------------- |
| /blog/machine-downtime-monito...     | blog      | (blank)                         | 1 +100% | 566 +216%   | 8.6 +2%   | 0.18% 0%  | 419 +598% | 4.54% +4%     |
| /blog/automated-downtime-track...    | blog      | machine downtime tracking       | 0 0%    | 560 +222%   | 4.2 -15%  | 0.00% 0%  | 305 +355% | 4.18% +3%     |
| /blog/predictive-maintenance-roi-... | blog      | predictive maintenance roi      | 0 -100% | 1K +88%     | 3.9 -17%  | 0.00% 0%  | 279 +329% | 3.39% +3%     |
| /blog/production-line-monitoring...  | blog      | production line monitoring      | 0 -100% | 205 -53%    | 5.3 -14%  | 0.00% 0%  | 162 -18%  | 1.93% 0%      |
| /blog/oee-implementation             | blog      | how to calculate oee            | 0 -100% | 309 +173%   | 5.4 -11%  | 0.00% -1% | 158 +285% | 2.14% +2%     |
| /blog/predictive-maintenance-sof...  | blog      | motor current signature anal... | 0 0%    | 219 +253%   | 5.4 0%    | 0.00% 0%  | 117 +550% | 1.01% +1%     |
| /blog/machine-condition-monitor...   | blog      | predictive maintenance man...   | 0 0%    | 138 +130%   | 4.6 +8%   | 0.00% 0%  | 90 +650%  | 1.13% +1%     |
| /solutions/increase-production       | solutions | production monitoring syste...  | 0 -100% | 1.2K +7%    | 22.6 +90% | 0.00% 0%  | 86 -19%   | 1.10% 0%      |
| /blog/production-monitoring-plat...  | blog      | production monitoring soft...   | 0 0%    | 138 -32%    | 10.1 +4%  | 0.00% 0%  | 75 0%     | 1.13% 0%      |
| /blog/top-extrusion-monitoring-s...  | blog      | extrusion monitoring systems    | 0 0%    | 181 -57%    | 4.5 -23%  | 0.00% 0%  | 73 -16%   | 1.13% 0%      |
| /blog/automated-factory-energy-...   | blog      | industrial energy monitoring    | 1 +100% | 304 +328%   | 4.8 -23%  | 0.33% 0%  | 73 +508%  | 0.82% +1%     |

### 8.4 Key Observations from Screenshot

- **GSC + AI data fusion** is the killer feature — seeing traditional search performance alongside AI citation data in one table lets content teams identify pages that are "AI-loved but SEO-neglected" (high citations, low clicks) or "SEO-strong but AI-invisible" (high impressions, zero citations)
- **Folder view** enables directory-level analysis — compare /blog/ performance vs. /solutions/ vs. /product/ etc.
- **Sitemap upload** suggests the system can auto-discover all pages rather than requiring manual URL entry
- **Change percentages are extreme** in AI citations (e.g., +598%, +650%) — this is expected because AI citation is still a new and volatile metric
- **CTR is universally near zero** for this brand in GSC, suggesting long-tail/informational content — but the same content has massive AI citation growth

### 8.5 Considerations for Implementation

- **Data source integration:** This page requires a **Google Search Console integration** to pull clicks, impressions, position, and CTR. Consider also integrating Google Analytics for traffic/conversion data (as Profound does)
- **Sitemap parsing:** Support XML sitemap upload and auto-discovery of pages
- **Folder taxonomy:** Auto-derive from URL path structure, but allow manual folder assignment/override
- **Sorting/filtering:** Critical to allow sorting by any column — users will want to sort by "Citations" descending, or "Citation Rate change" to find trending content

---

## 9. Screen — Citations (Detail View)

**Purpose:** A granular, URL-level view of every source being cited by AI engines in response to tracked prompts. Unlike the Citations Analytics tab (section 4), which shows aggregated charts and trends, this is a **flat data table** of individual cited URLs with rich metadata about each source. This view is essential for off-site content strategy and competitive intelligence.

### 9.1 Header & Filters

- **Page title:** "Citations"
- **Filters:** Date range (Mar 22 – Mar 28), Region (United States), Filter button
- **Insights Settings** link (top-right)

### 9.2 Upsell Banner

Same as Citations Analytics tab: "Offsite: Turn insights into placements — AirOps handles outreach, negotiation, and placement, so citations actually move the needle on your visibility." with "Talk to our team" CTA and dismiss (×) button.

### 9.3 View Toggle & Export

- **View toggle tabs:** "URL" (default, individual page view) | "Domain" (grouped by domain)
- **"Export CSV (10k rows)" button** (top-right) — bulk export for analysis in spreadsheets

### 9.4 Citations Data Table

**Component:** Sortable data table with checkbox selection column. Each row is a unique URL that has been cited by at least one AI engine in response to tracked prompts.

| Column                 | Type                            | Description                                                                                                                                                                       |
| ---------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ☐ (Checkbox)           | Selection                       | Bulk select for actions                                                                                                                                                           |
| URL                    | URL path (truncated)            | The cited URL. Does not include protocol. e.g., "guidewheel.com/blog/machine-downtime-monitoring"                                                                                 |
| Brand Referenced       | Yes/No badge                    | Whether the brand is mentioned/referenced on this page. ✅ "Yes" (green badge) or ⊘ "No" (gray badge)                                                                             |
| Competitors Referenced | Icon badges or "No competitors" | Which competitor brands appear on this page. Shows competitor brand icons if present, or "No competitors" text. e.g., competitor logo badges for Vorne (🔵), Machine Metrics (🟢) |
| Influence Score        | Bar chart + number              | Numeric score (0–100) representing how influential this citation source is for AI responses. Shown with a mini bar chart icon. e.g., "📊 86", "📊 92"                             |
| Domain                 | Brand icon + name               | The root domain / brand that owns this URL. e.g., "◎ Guidewheel", "🔵 Vorne", "✕ MaintainX"                                                                                       |
| Domain Type            | Color-coded tag                 | Classification of the domain's relationship to the brand: "● Owned" (blue), "● Products" (green), "● Competitors" (green), "● Educational" (blue)                                 |
| Domain Authority       | Integer                         | Domain authority score (third-party metric, likely Moz or Ahrefs DA). e.g., 29, 42, 61                                                                                            |
| Page Type              | Color-coded tag                 | Classification of the page content: "◎ Informational Article", "◎ Listicle Article", "◎ Support Article"                                                                          |
| U... (truncated)       | Unknown                         | Column partially cut off — likely "URL Type" or another classification                                                                                                            |

**Data observed:**

| URL                                                             | Brand Ref | Competitors Ref   | Influence | Domain     | Domain Type | DA  | Page Type             |
| --------------------------------------------------------------- | --------- | ----------------- | --------- | ---------- | ----------- | --- | --------------------- |
| guidewheel.com/blog/machine-downtime-monitoring                 | ✅ Yes    | No competitors    | 86        | Guidewheel | Owned       | 29  | Informational Article |
| tractian.com/en/blog/machine-downtime-tracking                  | ⊘ No      | No competitors    | 88        | Tractian   | Products    | 42  | Informational Article |
| guidewheel.com/blog/automated-downtime-tracking                 | ✅ Yes    | No competitors    | 86        | Guidewheel | Owned       | 29  | Informational Article |
| getmaintainx.com/blog/downtime-tracking                         | ⊘ No      | No competitors    | 92        | MaintainX  | Products    | 61  | Informational Article |
| guidewheel.com/blog/predictive-maintenance-roi-2026             | ✅ Yes    | No competitors    | 86        | Guidewheel | Owned       | 29  | Informational Article |
| vorne.com/solutions/use-cases/reduce-down-time/optimizing-...   | ⊘ No      | 🔵 Vorne          | 87        | Vorne      | Competitors | 35  | Informational Article |
| fabrico.io/blog/best-production-downtime-tracking-software-2... | ⊘ No      | 🟢🔵 (MM + Vorne) | 86        | Fabrico    | Products    | 28  | Listicle Article      |
| makula.io/blog/production-downtime-tracking                     | ⊘ No      | No competitors    | 84        | Makula     | Products    | 20  | Informational Article |
| oee.com/faq/                                                    | ⊘ No      | 🔵 Vorne          | 87        | Oee        | Educational | 37  | Support Article       |

### 9.5 Key Observations from Screenshot

- **"Brand Referenced" column** is extremely actionable — pages where Brand Referenced = "No" but the page is being cited by AI are prime targets for outreach (get the brand mentioned on that page to increase visibility)
- **"Competitors Referenced" column** shows competitive intelligence — which competitor brands appear on highly-cited third-party pages
- **"Influence Score"** is a proprietary metric that likely combines citation frequency, domain authority, and relevance to indicate how much a source influences AI responses
- **Domain Type classification** ("Owned" / "Products" / "Competitors" / "Educational") helps users segment the citation landscape into actionable categories
- **Page Type classification** ("Informational Article" / "Listicle Article" / "Support Article") reveals what content formats AI models prefer to cite
- **Domain Authority** integration suggests GSC or a third-party SEO tool (Moz/Ahrefs) is connected
- **Export CSV (10k rows)** indicates this table can be very large — pagination and efficient querying are important

### 9.6 Domain View (Alternate Tab)

When toggling to the "Domain" view, the table likely groups data by root domain instead of individual URLs, showing:

- Domain name + icon
- Total citations from this domain
- Number of unique URLs cited
- Domain Type (Owned / Products / Competitors / Educational)
- Domain Authority
- Brand Referenced (any page on this domain)
- Competitors Referenced (aggregate)

### 9.7 Relationship to Opportunities Page

This Citations Detail View is the **data foundation** for the Opportunities page (section 10). By filtering for:

- Domain Type = "Products" or "Educational" + Brand Referenced = "No" + High Influence Score → **Off-site placement opportunities**
- Domain Type = "Competitors" + Brand Referenced = "No" → **Competitive displacement opportunities**
- Domain Type = "Owned" + Low Citation Rate → **Content optimization opportunities**

---

## 10. Page — Opportunities

**Purpose:** Identify actionable opportunities to improve AI visibility — content gaps, off-site placement opportunities, and strategic recommendations.

> ⚠️ **No screenshot provided yet.** This spec is based on AirOps' "Offsite" feature description + Profound's "Actions" feature + competitive intelligence.

### 10.1 Opportunity Score / Summary

**Component:** KPI cards or summary section

| Card                        | Description                                         |
| --------------------------- | --------------------------------------------------- |
| Total Opportunities         | Count of identified opportunities                   |
| High Priority               | Count where effort/impact ratio is favorable        |
| Estimated Visibility Uplift | Projected improvement if opportunities are acted on |

### 10.2 Content Gap Analysis

**Component:** Table or card-based list

Identify prompts/topics where the brand is NOT mentioned but competitors ARE:

| Column                  | Description                          |
| ----------------------- | ------------------------------------ |
| Prompt / Topic          | The relevant prompt or topic cluster |
| Your Mention Rate       | Current % (likely 0% or low)         |
| Top Competitor          | Which competitor is winning here     |
| Competitor Mention Rate | Their %                              |
| Suggested Action        | Content brief or recommendation      |

### 10.3 Off-Site Placement Opportunities

Based on the AirOps "Offsite" concept and the Citations Detail View data (section 9) — identify third-party sources that AI models frequently cite, where the brand could potentially get mentioned or linked. This view is essentially a filtered/prioritized version of the Citations Detail table, showing rows where Brand Referenced = "No" and Influence Score is high:

| Column                 | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| Source URL / Domain    | The third-party page or site                         |
| Influence Score        | From Citations Detail — how impactful this source is |
| Citation Frequency     | How often this source is cited by AI                 |
| Domain Type            | Products / Educational / Competitors                 |
| Domain Authority       | DA score                                             |
| Relevant Topics        | Which of your topics this source covers              |
| Current Brand Presence | Yes/No — is your brand already mentioned there?      |
| Competitors Present    | Which competitors are referenced on this page        |
| Action                 | "Request placement" / "Create content brief"         |

### 10.4 Content Briefs (Profound-Inspired)

Profound's "Actions" feature generates content briefs based on AI visibility data. Consider including:

- **Auto-generated briefs** for content that would fill visibility gaps
- **Performance benchmarks** showing what top-cited content looks like
- **Target platforms** — which AI engines the content should be optimized for
- **Suggested structure** — headings, topics to cover, sources to reference

### 10.5 Priority Matrix

**Component:** Visualization (e.g., 2×2 matrix or ranked list)

- X-axis: Effort (Low → High)
- Y-axis: Impact (Low → High)
- Plot each opportunity as a dot/card
- Help users prioritize what to act on first

---

## 11. Page — Reports

**Purpose:** Create, schedule, and share analytics reports with stakeholders.

> ⚠️ **No screenshot provided yet.** Based on AirOps tab presence + Peec/Profound reporting features.

### 11.1 Report Builder

**Component:** Report configuration interface

| Setting                | Options                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------- |
| Report Name            | Free text                                                                              |
| Date Range             | Same as global filter options                                                          |
| Sections to Include    | Checkboxes: Overview KPIs, Visibility, Citations, Community, Sentiment, Prompts, Pages |
| Competitors to Include | Multi-select from tracked competitors                                                  |
| Platforms to Include   | Multi-select from tracked platforms                                                    |
| Format                 | PDF / CSV / Looker Studio export / API                                                 |

### 11.2 Saved Reports Library

- List of previously created/saved report configurations
- Last generated date
- Schedule status (one-time / weekly / monthly)
- Recipients (email list)

### 11.3 Scheduled Reports

- Configure automatic report generation and email delivery
- Frequency: Daily / Weekly / Monthly
- Recipients: Email addresses or Slack channels
- Auto-attach CSV data export option

### 11.4 Data Export Options (Cross-Cutting)

Based on Peec's export capabilities:

- **CSV export** from any table/chart across the dashboard
- **Looker Studio connector** for custom dashboards
- **API access** for programmatic data retrieval (consider tiering: basic on Pro, full on Enterprise)

---

## 12. Cross-Platform Feature Comparison: What to Prioritize

Based on competitive analysis, here's what each platform does well that should inform prioritization:

### From AirOps (Primary Reference)

| Feature                                               | Priority | Notes                                                                                         |
| ----------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------- |
| Overview dashboard with 5 KPI cards                   | P0       | Already designed, keep as-is                                                                  |
| Visibility with time series + competitor leaderboards | P0       | Three-section layout (mention, SoV, position) is excellent                                    |
| Platform × Brand heatmap                              | P0       | Unique and extremely insightful                                                               |
| Topic-based mention analysis                          | P0       | Critical for category-focused brands                                                          |
| Citations analytics with domain/URL breakdown         | P0       | Core differentiator vs basic tools                                                            |
| Citations detail view with Influence Score + metadata | P0       | Actionable URL-level intelligence — Brand Referenced / Competitors Referenced columns are key |
| Pages screen (GSC + AI citation fusion)               | P0       | Bridges traditional SEO and AI visibility in one table — killer feature                       |
| Prompts screen with Query Fanouts                     | P0       | Conversational prompts + fanout variations ensure coverage                                    |
| Community/Reddit tracking                             | P1       | Unique to AirOps, valuable for brands in technical categories                                 |
| Sentiment treemap                                     | P0       | Visually powerful, great for stakeholder communication                                        |
| Offsite placement opportunities                       | P1       | Monetization / upsell opportunity                                                             |
| Smart Filters (on Pages)                              | P1       | Pre-built filter presets for common analytical views                                          |
| Sitemap upload (on Pages)                             | P1       | Auto-discover all site pages for tracking                                                     |
| CSV export (10k rows on Citations)                    | P0       | Essential for enterprise data workflows                                                       |

### From Profound (Key Differentiators to Consider)

| Feature                                  | Priority | Notes                                                                                          |
| ---------------------------------------- | -------- | ---------------------------------------------------------------------------------------------- |
| Prompt Volumes (real user query data)    | P1       | Major differentiator — requires data partnerships                                              |
| Agent Analytics (AI crawler tracking)    | P2       | Server-side bot tracking — separate product area                                               |
| Actions / Content Briefs                 | P1       | Turns insights into actionable content strategy                                                |
| Workflows (automated content operations) | P2       | Advanced automation layer                                                                      |
| Google Analytics integration             | P1       | Connect AI visibility to actual traffic/conversions                                            |
| Front-end scraping methodology           | P0       | Captures what real users see, not API responses                                                |
| 11+ AI platform coverage                 | P0       | ChatGPT, Perplexity, Claude, Copilot, Google AI, Gemini, Grok, Amazon Rufus, Meta AI, DeepSeek |
| SOC 2 Type II compliance                 | P1       | Enterprise requirement                                                                         |

### From Peec AI (Key Differentiators to Consider)

| Feature                                    | Priority | Notes                                      |
| ------------------------------------------ | -------- | ------------------------------------------ |
| Auto-suggested prompts from website        | P1       | Reduces onboarding friction dramatically   |
| Unlimited user seats                       | P1       | Attractive pricing model vs per-seat tools |
| 7-day free trial (no credit card)          | P0       | GTM strategy, not a product feature        |
| Clean, simple UI focused on essentials     | P0       | Design principle — avoid feature bloat     |
| Regional/country tracking per project      | P1       | Multi-market brands need this              |
| Looker Studio connector                    | P1       | Enterprise reporting requirement           |
| Persona/funnel stage tagging on prompts    | P1       | Better prompt organization                 |
| Brand alias tracking (parent + sub-brands) | P1       | e.g., Ferrero → Nutella, Kinder, etc.      |

---

## 13. Data Architecture Notes

### 13.1 Data Collection Methodology

Based on industry best practices (both Profound and Peec use front-end scraping, not API calls):

| Aspect                | Recommendation                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| **Collection method** | UI scraping / browser automation (captures real user experience)                                  |
| **Frequency**         | Daily prompt execution across all tracked platforms                                               |
| **Platforms**         | ChatGPT, Gemini, Perplexity, Google AI Mode, Google AI Overview, Claude, Grok, DeepSeek (minimum) |
| **Response storage**  | Full response text + metadata (citations, positions, sentiment)                                   |
| **Deduplication**     | AI responses vary — run each prompt daily and average over time                                   |

### 13.2 Key Metric Definitions

| Metric                 | Definition                                                                                                                                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mention Rate**       | (# of responses mentioning brand / total responses tracked) × 100                                                                                                                                          |
| **Share of Voice**     | (brand mentions / total mentions across brand + competitors) × 100                                                                                                                                         |
| **Citation Rate**      | (# of responses citing brand's domain / total responses tracked) × 100                                                                                                                                     |
| **Citation Share**     | (brand citations / total citations across all sources) × 100                                                                                                                                               |
| **Average Position**   | Mean position when brand appears in ranked/listed responses (1 = first mentioned)                                                                                                                          |
| **Sentiment Score**    | NLP-derived score 0–100 based on the tone/context of brand mentions                                                                                                                                        |
| **First Mention Rate** | (# of responses where brand is mentioned first / total responses with brand) × 100                                                                                                                         |
| **Influence Score**    | Composite score (0–100) representing how influential a citation source is for AI responses. Likely combines citation frequency, domain authority, and topical relevance. Observed on Citations Detail view |
| **Query Fanouts**      | Number of auto-generated prompt variations derived from a base prompt. Used to capture response variability across rephrased versions of the same question. Observed values: 8–14 fanouts per prompt       |
| **Domain Authority**   | Third-party domain authority metric (Moz DA or Ahrefs DR) pulled for each cited domain. Displayed on Citations Detail view                                                                                 |

### 13.3 Platform Coverage Priority

| Tier                 | Platforms                                                       | Rationale           |
| -------------------- | --------------------------------------------------------------- | ------------------- |
| Tier 1 (Launch)      | ChatGPT, Google AI Overview, Google AI Mode, Perplexity, Gemini | Highest user volume |
| Tier 2 (Fast Follow) | Claude, Grok, DeepSeek                                          | Growing user bases  |
| Tier 3 (Future)      | Meta AI, Amazon Rufus, Microsoft Copilot                        | Emerging / niche    |

---

## 14. Open Questions

| #   | Question                                                                                    | Context                                                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Should Prompts page include Prompt Volumes (real user data), or is this a separate product? | Profound treats this as a premium dataset requiring data partnerships. AirOps shows a "Prompt Volume" column with mini bar charts — may already have volume data |
| 2   | Should Community page expand beyond Reddit?                                                 | LinkedIn, YouTube, forums all get cited — but Reddit is dominant                                                                                                 |
| 3   | Should Opportunities page include content generation, or just briefs?                       | AirOps and Profound both offer content-adjacent features                                                                                                         |
| 4   | What's the pricing model for AI platform coverage?                                          | Peec charges per additional platform; Profound bundles all in                                                                                                    |
| 5   | How to handle the "Offsite placements" concept?                                             | AirOps positions this as a managed service upsell — banner appears on both Citations Analytics and Citations Detail views                                        |
| 6   | First Mention Rate as a standalone metric or embedded in Visibility?                        | AirOps lists it as a metric in their system; not prominent in screenshots                                                                                        |
| 7   | Agent Analytics (AI crawler tracking) — in scope or separate product?                       | Profound treats this as a distinct module with server-side integration                                                                                           |
| 8   | API access — which tier?                                                                    | Peec restricts to Enterprise; Profound offers broadly                                                                                                            |
| 9   | What is "Influence Score" in Citations Detail, and how is it calculated?                    | Likely a proprietary composite metric. Need to define our own formula — probably combines citation frequency, domain authority, relevance, and recency           |
| 10  | What is the "Query Fanouts" concept on Prompts, and how are fanouts generated?              | Each prompt shows 8–14 fanouts. These may be auto-generated variations of the base prompt to capture response variability. Is this AI-powered rephrasing?        |
| 11  | What GSC integration level is needed for the Pages screen?                                  | Pages screen requires clicks, impressions, position, CTR — needs Google Search Console API connection. How do we handle accounts without GSC connected?          |
| 12  | What does the truncated "Prom..." column on Pages represent?                                | Partially cut off in screenshot — likely "Prominence" or "Prompt Coverage". Need to clarify                                                                      |
| 13  | What does the truncated "U..." column on Citations Detail represent?                        | Partially cut off — could be "URL Type" or another classification column                                                                                         |
| 14  | How are Domain Types classified in Citations Detail?                                        | "Owned", "Products", "Competitors", "Educational" — is this auto-detected or user-configured?                                                                    |

---

## 15. Next Steps

1. **Collect remaining screenshots** — Reports tab, Opportunities/Offsite page from AirOps (if available)
2. **Clarify truncated columns** — get full-width screenshots of Pages and Citations Detail to see cut-off columns
3. **Define Influence Score formula** — determine how to calculate citation source influence
4. **Define Query Fanout logic** — determine how prompt variations are generated and executed
5. **Validate metric definitions** with engineering — ensure data pipeline can support all defined metrics
6. **Plan GSC integration** — scope the Google Search Console API connection for the Pages screen
7. **Wireframe each page** based on this PRD — component-level layout with exact positioning
8. **Define API contracts** — what data each component needs and in what format
9. **Prioritize for MVP** — decide which pages/components ship in v1 vs. v2
10. **User testing** — validate information hierarchy with target users (marketing teams, SEO managers)
