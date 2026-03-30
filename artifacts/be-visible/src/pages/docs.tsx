import { useLocation, useRoute } from "wouter";
import { useState, useEffect, type ReactNode } from "react";
import {
  BookOpen,
  Lightbulb,
  LayoutDashboard,
  Code2,
  HelpCircle,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SidebarSection {
  id: string;
  label: string;
  icon: ReactNode;
  items: { id: string; label: string }[];
}

// ---------------------------------------------------------------------------
// Sidebar structure
// ---------------------------------------------------------------------------

const sections: SidebarSection[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: <BookOpen className="w-4 h-4" />,
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "quick-start", label: "Quick Start" },
      { id: "creating-your-first-audit", label: "Creating Your First Audit" },
    ],
  },
  {
    id: "core-concepts",
    label: "Core Concepts",
    icon: <Lightbulb className="w-4 h-4" />,
    items: [
      { id: "how-aeo-works", label: "How AEO Works" },
      {
        id: "mention-rate-share-of-voice",
        label: "Mention Rate & Share of Voice",
      },
      { id: "citation-tracking", label: "Citation Tracking" },
      { id: "sentiment-analysis", label: "Sentiment Analysis" },
    ],
  },
  {
    id: "dashboard-guide",
    label: "Dashboard Guide",
    icon: <LayoutDashboard className="w-4 h-4" />,
    items: [
      { id: "overview-page", label: "Overview Page" },
      { id: "visibility-metrics", label: "Visibility Metrics" },
      { id: "citations-analytics", label: "Citations Analytics" },
      { id: "community-tracking", label: "Community Tracking" },
    ],
  },
  {
    id: "api-reference",
    label: "API Reference",
    icon: <Code2 className="w-4 h-4" />,
    items: [
      { id: "authentication", label: "Authentication" },
      { id: "endpoints-overview", label: "Endpoints Overview" },
      { id: "rate-limits", label: "Rate Limits" },
    ],
  },
  {
    id: "faq",
    label: "FAQ",
    icon: <HelpCircle className="w-4 h-4" />,
    items: [{ id: "faq", label: "Frequently Asked Questions" }],
  },
];

// All item IDs flattened for lookup
const allItemIds = sections.flatMap((s) => s.items.map((i) => i.id));

// ---------------------------------------------------------------------------
// Content map
// ---------------------------------------------------------------------------

const content: Record<string, ReactNode> = {
  introduction: (
    <article>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Introduction</h1>
      <p className="text-neutral-600 leading-relaxed mb-4">
        bVisible is the visibility layer for the agentic web. As AI-powered
        search engines like ChatGPT, Perplexity, and Google AI Overviews reshape
        how people discover brands, traditional SEO metrics no longer tell the
        full story. bVisible gives you real-time insight into how large language
        models perceive, cite, and recommend your brand.
      </p>
      <p className="text-neutral-600 leading-relaxed mb-4">
        The platform continuously monitors a curated set of prompts across
        multiple AI engines, tracking where your brand appears, what content
        gets cited, how your sentiment compares to competitors, and where
        opportunities exist to improve your share of voice.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-4">Who is bVisible for?</h2>
      <ul className="list-disc pl-6 space-y-2 text-neutral-600">
        <li>
          Growth and marketing teams who want to understand AI-driven discovery
          channels.
        </li>
        <li>
          SEO professionals expanding into Answer Engine Optimization (AEO).
        </li>
        <li>
          Brand managers who need to monitor how LLMs describe their products.
        </li>
        <li>
          Agencies managing visibility for multiple clients across AI search.
        </li>
      </ul>
    </article>
  ),

  "quick-start": (
    <article>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Quick Start</h1>
      <p className="text-neutral-600 leading-relaxed mb-4">
        Get up and running with bVisible in under five minutes.
      </p>
      <ol className="list-decimal pl-6 space-y-4 text-neutral-600">
        <li>
          <strong className="text-[#0F0F10]">Create a workspace</strong> --
          Navigate to the setup page and enter your brand name, domain, and a
          short description. This information helps bVisible tailor prompts to
          your industry.
        </li>
        <li>
          <strong className="text-[#0F0F10]">Add competitors</strong> -- List up
          to five competitors so bVisible can benchmark your share of voice
          against theirs.
        </li>
        <li>
          <strong className="text-[#0F0F10]">Run your first audit</strong> --
          Click "Start Audit" to generate prompts and collect AI engine
          responses. The initial run typically takes 2-5 minutes.
        </li>
        <li>
          <strong className="text-[#0F0F10]">Explore the dashboard</strong> --
          Once the audit completes, head to the Overview page to see your
          mention rate, citation breakdown, and sentiment scores.
        </li>
      </ol>
    </article>
  ),

  "creating-your-first-audit": (
    <article>
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Creating Your First Audit
      </h1>
      <p className="text-neutral-600 leading-relaxed mb-4">
        An audit is a snapshot of your brand's visibility across AI search
        engines at a specific point in time. bVisible sends a curated set of
        prompts to multiple LLMs and records how each model responds.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-4">Audit workflow</h2>
      <ol className="list-decimal pl-6 space-y-3 text-neutral-600">
        <li>
          bVisible generates prompts based on your brand, industry, and
          competitors.
        </li>
        <li>
          Each prompt is sent to supported AI engines (ChatGPT, Perplexity,
          Gemini, and others).
        </li>
        <li>
          Responses are parsed for mentions of your brand, competitor brands,
          and cited URLs.
        </li>
        <li>
          Results are aggregated into the visibility, citation, and sentiment
          dashboards.
        </li>
      </ol>
      <p className="text-neutral-600 leading-relaxed mt-4">
        You can schedule recurring audits (daily, weekly, or monthly) to track
        changes over time. Historical data is available on every dashboard
        chart.
      </p>
    </article>
  ),

  "how-aeo-works": (
    <article>
      <h1 className="text-3xl font-bold tracking-tight mb-6">How AEO Works</h1>
      <p className="text-neutral-600 leading-relaxed mb-4">
        Answer Engine Optimization (AEO) is the practice of improving how your
        brand appears in AI-generated answers. Unlike traditional SEO, which
        focuses on ranking blue links, AEO focuses on being included in the
        synthesized response that LLMs provide to users.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-4">
        Key differences from SEO
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-[#E2E2E3] rounded-lg overflow-hidden mt-2 mb-4">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold border-b border-[#E2E2E3]">
                Dimension
              </th>
              <th className="text-left px-4 py-3 font-semibold border-b border-[#E2E2E3]">
                SEO
              </th>
              <th className="text-left px-4 py-3 font-semibold border-b border-[#E2E2E3]">
                AEO
              </th>
            </tr>
          </thead>
          <tbody className="text-neutral-600">
            <tr className="border-b border-[#E2E2E3]">
              <td className="px-4 py-3">Goal</td>
              <td className="px-4 py-3">Rank in search results</td>
              <td className="px-4 py-3">Appear in AI-generated answers</td>
            </tr>
            <tr className="border-b border-[#E2E2E3]">
              <td className="px-4 py-3">Measurement</td>
              <td className="px-4 py-3">Position, CTR</td>
              <td className="px-4 py-3">Mention rate, share of voice</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Optimization</td>
              <td className="px-4 py-3">Keywords, backlinks</td>
              <td className="px-4 py-3">
                Structured content, authority signals
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-neutral-600 leading-relaxed">
        bVisible helps you understand and optimize for AEO by tracking how AI
        models reference your brand, which sources they cite, and what narrative
        they construct around your products.
      </p>
    </article>
  ),

  "mention-rate-share-of-voice": (
    <article>
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Mention Rate &amp; Share of Voice
      </h1>
      <p className="text-neutral-600 leading-relaxed mb-4">
        <strong className="text-[#0F0F10]">Mention Rate</strong> is the
        percentage of AI responses that include a reference to your brand. If
        you track 100 prompts and your brand appears in 34 responses, your
        mention rate is 34%.
      </p>
      <p className="text-neutral-600 leading-relaxed mb-4">
        <strong className="text-[#0F0F10]">Share of Voice (SoV)</strong>{" "}
        compares your mention rate to competitors within the same prompt set. If
        your brand is mentioned in 34% of responses and your closest competitor
        appears in 28%, you have a higher share of voice for that topic cluster.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-4">How to improve</h2>
      <ul className="list-disc pl-6 space-y-2 text-neutral-600">
        <li>
          Publish authoritative, well-structured content that LLMs can easily
          parse.
        </li>
        <li>
          Ensure your brand is consistently mentioned in industry publications
          and reviews.
        </li>
        <li>
          Maintain accurate and up-to-date information across your owned
          properties.
        </li>
        <li>
          Address topic gaps where competitors lead but your brand is absent.
        </li>
      </ul>
    </article>
  ),

  "citation-tracking": (
    <article>
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Citation Tracking
      </h1>
      <p className="text-neutral-600 leading-relaxed mb-4">
        When AI engines generate responses, they often cite external URLs as
        sources. bVisible captures every cited URL across all monitored prompts
        and categorizes them by domain, page, and frequency.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-4">What you can learn</h2>
      <ul className="list-disc pl-6 space-y-2 text-neutral-600">
        <li>
          <strong className="text-[#0F0F10]">Your citations</strong> -- Which of
          your pages are being referenced by AI engines, and how often.
        </li>
        <li>
          <strong className="text-[#0F0F10]">Competitor citations</strong> --
          Which competitor pages are cited alongside (or instead of) yours.
        </li>
        <li>
          <strong className="text-[#0F0F10]">Third-party citations</strong> --
          Industry publications, review sites, and other domains that influence
          AI responses about your brand.
        </li>
      </ul>
      <p className="text-neutral-600 leading-relaxed mt-4">
        Use citation data to identify your highest-performing content, discover
        gaps in coverage, and prioritize content creation efforts.
      </p>
    </article>
  ),

  "sentiment-analysis": (
    <article>
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Sentiment Analysis
      </h1>
      <p className="text-neutral-600 leading-relaxed mb-4">
        bVisible analyzes the sentiment of every AI-generated response that
        mentions your brand. Each response is scored on a scale from strongly
        negative to strongly positive, giving you a clear picture of how LLMs
        frame your brand to users.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-4">Sentiment categories</h2>
      <div className="space-y-3 text-neutral-600">
        <div className="flex items-start gap-3">
          <span className="inline-block w-3 h-3 mt-1.5 rounded-full bg-green-500 shrink-0" />
          <span>
            <strong className="text-[#0F0F10]">Positive</strong> -- The response
            highlights strengths, recommends your product, or places your brand
            favorably.
          </span>
        </div>
        <div className="flex items-start gap-3">
          <span className="inline-block w-3 h-3 mt-1.5 rounded-full bg-neutral-400 shrink-0" />
          <span>
            <strong className="text-[#0F0F10]">Neutral</strong> -- The response
            mentions your brand factually without strong positive or negative
            framing.
          </span>
        </div>
        <div className="flex items-start gap-3">
          <span className="inline-block w-3 h-3 mt-1.5 rounded-full bg-red-500 shrink-0" />
          <span>
            <strong className="text-[#0F0F10]">Negative</strong> -- The response
            highlights weaknesses, warns users, or favors competitors
            explicitly.
          </span>
        </div>
      </div>
    </article>
  ),

  "overview-page": (
    <article>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Overview Page</h1>
      <p className="text-neutral-600 leading-relaxed mb-4">
        The Overview page is your command center. It surfaces the most important
        metrics at a glance so you can quickly assess your brand's AI visibility
        health.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-4">Key widgets</h2>
      <ul className="list-disc pl-6 space-y-2 text-neutral-600">
        <li>
          <strong className="text-[#0F0F10]">Mention Rate</strong> -- Your
          brand's overall mention rate across all tracked prompts, with trend
          over time.
        </li>
        <li>
          <strong className="text-[#0F0F10]">Share of Voice</strong> -- A
          comparative bar chart showing your mention rate vs. competitors.
        </li>
        <li>
          <strong className="text-[#0F0F10]">Top Citations</strong> -- The most
          frequently cited URLs from your domain.
        </li>
        <li>
          <strong className="text-[#0F0F10]">Sentiment Distribution</strong> --
          A breakdown of positive, neutral, and negative responses.
        </li>
        <li>
          <strong className="text-[#0F0F10]">Recent Activity</strong> -- A
          timeline of the latest audit runs and notable changes.
        </li>
      </ul>
    </article>
  ),

  "visibility-metrics": (
    <article>
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Visibility Metrics
      </h1>
      <p className="text-neutral-600 leading-relaxed mb-4">
        The Visibility page provides a deep dive into how and where your brand
        appears across AI engines. Metrics are broken down by engine (ChatGPT,
        Perplexity, Gemini, etc.), by topic cluster, and by time period.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-4">Available views</h2>
      <ul className="list-disc pl-6 space-y-2 text-neutral-600">
        <li>
          <strong className="text-[#0F0F10]">By Engine</strong> -- Compare your
          visibility across different AI platforms to see where you perform
          best.
        </li>
        <li>
          <strong className="text-[#0F0F10]">By Topic</strong> -- Understand
          which topic clusters drive the most mentions and where gaps exist.
        </li>
        <li>
          <strong className="text-[#0F0F10]">Trend Analysis</strong> -- Track
          visibility changes over time aligned with content or product updates.
        </li>
      </ul>
    </article>
  ),

  "citations-analytics": (
    <article>
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Citations Analytics
      </h1>
      <p className="text-neutral-600 leading-relaxed mb-4">
        The Citations Analytics dashboard aggregates all URLs cited in
        AI-generated responses and provides ranking, frequency, and trend data
        for each domain and page.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-4">Features</h2>
      <ul className="list-disc pl-6 space-y-2 text-neutral-600">
        <li>
          <strong className="text-[#0F0F10]">Domain leaderboard</strong> -- See
          which domains are most frequently cited across your prompt set.
        </li>
        <li>
          <strong className="text-[#0F0F10]">Page-level detail</strong> -- Drill
          into individual pages to see exactly which prompts trigger their
          citation.
        </li>
        <li>
          <strong className="text-[#0F0F10]">Competitor comparison</strong> --
          Compare your citation footprint against competitors side by side.
        </li>
        <li>
          <strong className="text-[#0F0F10]">New &amp; lost citations</strong>{" "}
          -- Track which pages gained or lost citations between audit runs.
        </li>
      </ul>
    </article>
  ),

  "community-tracking": (
    <article>
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Community Tracking
      </h1>
      <p className="text-neutral-600 leading-relaxed mb-4">
        Community Tracking monitors mentions of your brand on forums, social
        platforms, and community sites that influence AI training data.
        Platforms like Reddit, Stack Overflow, and niche forums often serve as
        grounding data for LLM responses.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-4">Why it matters</h2>
      <p className="text-neutral-600 leading-relaxed">
        AI models synthesize information from a wide range of sources. Community
        discussions shape how models perceive brand quality, common use cases,
        and product limitations. By monitoring these discussions, you can
        identify narrative risks early and amplify positive community sentiment.
      </p>
    </article>
  ),

  authentication: (
    <article>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Authentication</h1>
      <p className="text-neutral-600 leading-relaxed mb-4">
        The bVisible API uses API key authentication. Include your key in the{" "}
        <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">
          Authorization
        </code>{" "}
        header of every request.
      </p>
      <div className="bg-neutral-50 border border-[#E2E2E3] rounded-lg p-4 font-mono text-sm mb-4">
        <div className="text-neutral-400 mb-1"># Example request</div>
        <div>
          curl https://api.bvisible.io/v1/audits \<br />
          &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"
        </div>
      </div>
      <p className="text-neutral-600 leading-relaxed">
        You can generate API keys from the{" "}
        <strong className="text-[#0F0F10]">Settings &gt; API</strong> page in
        your dashboard. Keys can be scoped to read-only or read-write access.
      </p>
    </article>
  ),

  "endpoints-overview": (
    <article>
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Endpoints Overview
      </h1>
      <p className="text-neutral-600 leading-relaxed mb-4">
        The bVisible API is organized around REST principles. All responses
        return JSON. Below are the primary resource endpoints.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-[#E2E2E3] rounded-lg overflow-hidden mt-2 mb-4">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold border-b border-[#E2E2E3]">
                Method
              </th>
              <th className="text-left px-4 py-3 font-semibold border-b border-[#E2E2E3]">
                Endpoint
              </th>
              <th className="text-left px-4 py-3 font-semibold border-b border-[#E2E2E3]">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="text-neutral-600 font-mono">
            <tr className="border-b border-[#E2E2E3]">
              <td className="px-4 py-3">
                <span className="text-green-600 font-semibold font-sans">
                  GET
                </span>
              </td>
              <td className="px-4 py-3">/v1/workspace</td>
              <td className="px-4 py-3 font-sans">
                Retrieve workspace configuration
              </td>
            </tr>
            <tr className="border-b border-[#E2E2E3]">
              <td className="px-4 py-3">
                <span className="text-green-600 font-semibold font-sans">
                  GET
                </span>
              </td>
              <td className="px-4 py-3">/v1/audits</td>
              <td className="px-4 py-3 font-sans">List all audits</td>
            </tr>
            <tr className="border-b border-[#E2E2E3]">
              <td className="px-4 py-3">
                <span className="text-blue-600 font-semibold font-sans">
                  POST
                </span>
              </td>
              <td className="px-4 py-3">/v1/audits</td>
              <td className="px-4 py-3 font-sans">Trigger a new audit</td>
            </tr>
            <tr className="border-b border-[#E2E2E3]">
              <td className="px-4 py-3">
                <span className="text-green-600 font-semibold font-sans">
                  GET
                </span>
              </td>
              <td className="px-4 py-3">/v1/prompts</td>
              <td className="px-4 py-3 font-sans">List tracked prompts</td>
            </tr>
            <tr className="border-b border-[#E2E2E3]">
              <td className="px-4 py-3">
                <span className="text-green-600 font-semibold font-sans">
                  GET
                </span>
              </td>
              <td className="px-4 py-3">/v1/citations</td>
              <td className="px-4 py-3 font-sans">
                List all captured citations
              </td>
            </tr>
            <tr className="border-b border-[#E2E2E3]">
              <td className="px-4 py-3">
                <span className="text-green-600 font-semibold font-sans">
                  GET
                </span>
              </td>
              <td className="px-4 py-3">/v1/visibility</td>
              <td className="px-4 py-3 font-sans">
                Retrieve visibility metrics
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3">
                <span className="text-green-600 font-semibold font-sans">
                  GET
                </span>
              </td>
              <td className="px-4 py-3">/v1/sentiment</td>
              <td className="px-4 py-3 font-sans">
                Retrieve sentiment analysis data
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-neutral-600 leading-relaxed">
        All list endpoints support pagination via{" "}
        <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">
          limit
        </code>{" "}
        and{" "}
        <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">
          offset
        </code>{" "}
        query parameters. Default limit is 50, maximum is 200.
      </p>
    </article>
  ),

  "rate-limits": (
    <article>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Rate Limits</h1>
      <p className="text-neutral-600 leading-relaxed mb-4">
        To ensure service reliability, the bVisible API enforces rate limits on
        all endpoints.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-[#E2E2E3] rounded-lg overflow-hidden mt-2 mb-4">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold border-b border-[#E2E2E3]">
                Plan
              </th>
              <th className="text-left px-4 py-3 font-semibold border-b border-[#E2E2E3]">
                Requests/min
              </th>
              <th className="text-left px-4 py-3 font-semibold border-b border-[#E2E2E3]">
                Requests/day
              </th>
            </tr>
          </thead>
          <tbody className="text-neutral-600">
            <tr className="border-b border-[#E2E2E3]">
              <td className="px-4 py-3">Free</td>
              <td className="px-4 py-3">30</td>
              <td className="px-4 py-3">1,000</td>
            </tr>
            <tr className="border-b border-[#E2E2E3]">
              <td className="px-4 py-3">Pro</td>
              <td className="px-4 py-3">120</td>
              <td className="px-4 py-3">10,000</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Enterprise</td>
              <td className="px-4 py-3">600</td>
              <td className="px-4 py-3">100,000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-neutral-600 leading-relaxed">
        When you exceed the limit, the API returns{" "}
        <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">
          429 Too Many Requests
        </code>
        . The{" "}
        <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono">
          Retry-After
        </code>{" "}
        header indicates how many seconds to wait before retrying.
      </p>
    </article>
  ),

  faq: (
    <article>
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Frequently Asked Questions
      </h1>
      <div className="space-y-8">
        {[
          {
            q: "Which AI engines does bVisible monitor?",
            a: "bVisible currently monitors ChatGPT, Perplexity, Google AI Overviews, Gemini, and Claude. We are continuously adding support for new engines as they gain adoption.",
          },
          {
            q: "How often should I run audits?",
            a: "We recommend weekly audits for most brands. Fast-moving industries (tech, finance) may benefit from daily audits. Monthly audits work well for initial benchmarking.",
          },
          {
            q: "Can I track multiple brands in one workspace?",
            a: "Currently each workspace tracks a single primary brand and up to five competitors. If you manage multiple brands, you can create separate workspaces for each.",
          },
          {
            q: "How is mention rate calculated?",
            a: "Mention rate is the number of AI responses that reference your brand divided by the total number of prompts sent in an audit, expressed as a percentage.",
          },
          {
            q: "Does bVisible affect my SEO?",
            a: "No. bVisible is a monitoring-only platform. It reads AI-generated responses but does not modify your website, submit content to search engines, or interact with your SEO infrastructure in any way.",
          },
          {
            q: "Is there a free plan?",
            a: "Yes. The free plan includes up to 50 tracked prompts and weekly audits. Upgrade to Pro for unlimited prompts, daily audits, and API access.",
          },
        ].map(({ q, a }) => (
          <div key={q}>
            <h3 className="text-lg font-semibold mb-2">{q}</h3>
            <p className="text-neutral-600 leading-relaxed">{a}</p>
          </div>
        ))}
      </div>
    </article>
  ),
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DocsPage() {
  const [, setLocation] = useLocation();
  const [matched, params] = useRoute("/docs/:section");

  const sectionFromUrl = matched && params?.section ? params.section : null;
  const initialSection =
    sectionFromUrl && allItemIds.includes(sectionFromUrl)
      ? sectionFromUrl
      : "introduction";

  const [activeSection, setActiveSection] = useState(initialSection);

  // Sync URL -> state when route changes
  useEffect(() => {
    if (sectionFromUrl && allItemIds.includes(sectionFromUrl)) {
      setActiveSection(sectionFromUrl);
    }
  }, [sectionFromUrl]);

  const handleNavigate = (id: string) => {
    setActiveSection(id);
    setLocation(`/docs/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white text-[#0F0F10] min-h-screen">
      {/* Header */}
      <header className="w-full top-0 sticky z-50 bg-white/80 backdrop-blur-md border-b border-[#E2E2E3]/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2">
              <img
                src="/images/bvisible-logo.svg"
                alt="bVisible logo"
                className="h-9 w-9"
              />
              <img
                src="/images/bvisible-text.svg"
                alt="bVisible"
                className="h-5"
              />
            </a>
            <span className="text-[#E2E2E3]">|</span>
            <span className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">
              Docs
            </span>
          </div>
          <a
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-[#0F0F10]/60 hover:text-[#0F0F10] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </a>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 border-r border-[#E2E2E3]/50">
          <nav className="sticky top-20 py-8 pl-6 pr-4 space-y-6 max-h-[calc(100vh-5rem)] overflow-y-auto">
            {sections.map((section) => (
              <div key={section.id}>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  {section.icon}
                  {section.label}
                </div>
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                          activeSection === item.id
                            ? "bg-neutral-100 text-[#0F0F10] font-medium"
                            : "text-neutral-500 hover:text-[#0F0F10] hover:bg-neutral-50"
                        }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden w-full border-b border-[#E2E2E3]/50 px-4 py-3 overflow-x-auto">
          <div className="flex gap-2">
            {sections.flatMap((s) =>
              s.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-[#0F0F10] text-white"
                      : "bg-neutral-100 text-neutral-500 hover:text-[#0F0F10]"
                  }`}
                >
                  {item.label}
                </button>
              )),
            )}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 min-w-0 px-6 md:px-12 py-10 md:py-12 max-w-3xl">
          {content[activeSection] ?? content["introduction"]}

          {/* Prev / Next navigation */}
          <div className="mt-16 pt-8 border-t border-[#E2E2E3] flex justify-between">
            {(() => {
              const currentIdx = allItemIds.indexOf(activeSection);
              const prev = currentIdx > 0 ? allItemIds[currentIdx - 1] : null;
              const next =
                currentIdx < allItemIds.length - 1
                  ? allItemIds[currentIdx + 1]
                  : null;

              const labelFor = (id: string) => {
                for (const s of sections) {
                  const item = s.items.find((i) => i.id === id);
                  if (item) return item.label;
                }
                return id;
              };

              return (
                <>
                  {prev ? (
                    <button
                      onClick={() => handleNavigate(prev)}
                      className="text-sm text-neutral-500 hover:text-[#0F0F10] transition-colors flex items-center gap-1"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      {labelFor(prev)}
                    </button>
                  ) : (
                    <span />
                  )}
                  {next ? (
                    <button
                      onClick={() => handleNavigate(next)}
                      className="text-sm text-neutral-500 hover:text-[#0F0F10] transition-colors flex items-center gap-1"
                    >
                      {labelFor(next)}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <span />
                  )}
                </>
              );
            })()}
          </div>
        </main>
      </div>
    </div>
  );
}
