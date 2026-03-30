import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: "AEO Strategy" | "Product Updates" | "Industry Insights" | "Guides";
  date: string;
  readTime: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "how-ai-search-is-reshaping-brand-discovery-2026",
    title: "How AI Search is Reshaping Brand Discovery in 2026",
    excerpt:
      "The way consumers discover brands has fundamentally shifted. AI-powered search engines now synthesize answers from multiple sources, and your brand's visibility depends on how well models understand your content.",
    category: "AEO Strategy",
    date: "Mar 28, 2026",
    readTime: "8 min",
  },
  {
    slug: "the-complete-guide-to-answer-engine-optimization",
    title: "The Complete Guide to Answer Engine Optimization",
    excerpt:
      "Answer Engine Optimization (AEO) is the practice of optimizing your content to be surfaced, cited, and accurately represented by AI models. This comprehensive guide covers everything you need to get started.",
    category: "Guides",
    date: "Mar 25, 2026",
    readTime: "12 min",
  },
  {
    slug: "why-your-seo-strategy-needs-an-aeo-layer",
    title: "Why Your SEO Strategy Needs an AEO Layer",
    excerpt:
      "SEO alone is no longer enough. As AI search engines increasingly mediate brand discovery, marketers need a dedicated AEO layer to ensure visibility in synthesized responses.",
    category: "AEO Strategy",
    date: "Mar 22, 2026",
    readTime: "6 min",
  },
  {
    slug: "introducing-citation-analytics",
    title: "Introducing Citation Analytics: Track What AI Models Cite",
    excerpt:
      "We're excited to announce Citation Analytics — a new feature that lets you see exactly which pages AI models reference when generating answers about your brand.",
    category: "Product Updates",
    date: "Mar 20, 2026",
    readTime: "4 min",
  },
  {
    slug: "5-brands-winning-at-ai-visibility",
    title: "5 Brands Winning at AI Visibility (And What They Do Differently)",
    excerpt:
      "Some brands consistently appear in AI-generated answers while competitors are invisible. We analyzed five leaders to uncover the strategies that set them apart.",
    category: "Industry Insights",
    date: "Mar 18, 2026",
    readTime: "10 min",
  },
  {
    slug: "understanding-sentiment-analysis-in-ai-responses",
    title: "Understanding Sentiment Analysis in AI Responses",
    excerpt:
      "When AI models mention your brand, the tone matters as much as the mention itself. Learn how sentiment analysis works in the context of AI-generated responses and how to influence it.",
    category: "Guides",
    date: "Mar 15, 2026",
    readTime: "7 min",
  },
  {
    slug: "google-ai-mode-vs-ai-overview",
    title: "Google AI Mode vs AI Overview: What Marketers Need to Know",
    excerpt:
      "Google's AI Mode and AI Overview serve different purposes and surface content differently. Understanding the distinction is critical for your AEO strategy.",
    category: "Industry Insights",
    date: "Mar 12, 2026",
    readTime: "9 min",
  },
  {
    slug: "bvisible-2-multi-platform-tracking",
    title: "bVisible 2.0: Multi-Platform Tracking Now Live",
    excerpt:
      "Track your brand's AI visibility across ChatGPT, Gemini, Perplexity, and more — all from a single dashboard. Multi-platform tracking is now available for all plans.",
    category: "Product Updates",
    date: "Mar 10, 2026",
    readTime: "3 min",
  },
];

const CATEGORIES = [
  "All",
  "AEO Strategy",
  "Product Updates",
  "Industry Insights",
  "Guides",
] as const;

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "AEO Strategy": { bg: "bg-blue-50", text: "text-blue-700" },
  "Product Updates": { bg: "bg-emerald-50", text: "text-emerald-700" },
  "Industry Insights": { bg: "bg-amber-50", text: "text-amber-700" },
  Guides: { bg: "bg-purple-50", text: "text-purple-700" },
};

export default function BlogPage() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered =
    activeCategory === "All"
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <div className="bg-white text-[#0F0F10] min-h-screen">
      {/* Navigation */}
      <header className="w-full top-0 sticky z-50 bg-white/80 backdrop-blur-md border-b border-[#E2E2E3]/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
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
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm font-medium text-[#0F0F10]/60 hover:text-[#0F0F10] transition-colors px-4"
            >
              Home
            </a>
            <button
              onClick={() => setLocation("/app")}
              className="bg-[#0F0F10] text-white px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-all active:scale-95"
            >
              Open App
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl">
            Insights on AI search visibility, AEO strategy, and brand
            optimization.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-[#0F0F10] text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((article) => {
            const colors = CATEGORY_COLORS[article.category];
            return (
              <button
                key={article.slug}
                onClick={() => setLocation(`/blog/${article.slug}`)}
                className="text-left group bg-white border border-[#E2E2E3] rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} mb-4`}
                >
                  {article.category}
                </span>
                <h2 className="text-xl font-bold mb-2 group-hover:text-neutral-700 transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>
                    {article.date} &middot; {article.readTime} read
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-[#E2E2E3] bg-white text-[#0F0F10]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
          <div>&copy; 2026 bVisible. All rights reserved.</div>
          <div className="flex gap-6">
            <a className="hover:text-black transition-colors" href="#">
              Twitter
            </a>
            <a className="hover:text-black transition-colors" href="#">
              LinkedIn
            </a>
            <a className="hover:text-black transition-colors" href="#">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
