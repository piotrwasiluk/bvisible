import { useLocation, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Link2, Twitter } from "lucide-react";
import { ARTICLES, type Article } from "./blog";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "AEO Strategy": { bg: "bg-blue-50", text: "text-blue-700" },
  "Product Updates": { bg: "bg-emerald-50", text: "text-emerald-700" },
  "Industry Insights": { bg: "bg-amber-50", text: "text-amber-700" },
  Guides: { bg: "bg-purple-50", text: "text-purple-700" },
};

function getRelatedArticles(current: Article): Article[] {
  return ARTICLES.filter(
    (a) => a.slug !== current.slug && a.category === current.category,
  )
    .slice(0, 2)
    .concat(
      ARTICLES.filter(
        (a) => a.slug !== current.slug && a.category !== current.category,
      ).slice(0, 1),
    )
    .slice(0, 3);
}

export default function BlogArticlePage() {
  const [, setLocation] = useLocation();
  const { slug } = useParams<{ slug: string }>();

  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="bg-white text-[#0F0F10] min-h-screen">
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
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Article not found</h1>
          <p className="text-neutral-500 mb-8">
            The article you're looking for doesn't exist or has been moved.
          </p>
          <button
            onClick={() => setLocation("/blog")}
            className="text-sm font-medium text-[#0F0F10] hover:underline inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </button>
        </main>
      </div>
    );
  }

  const colors = CATEGORY_COLORS[article.category];
  const related = getRelatedArticles(article);

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
            <button
              onClick={() => setLocation("/blog")}
              className="text-sm font-medium text-[#0F0F10]/60 hover:text-[#0F0F10] transition-colors px-4"
            >
              Blog
            </button>
            <button
              onClick={() => setLocation("/app")}
              className="bg-[#0F0F10] text-white px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-all active:scale-95"
            >
              Open App
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Back Link */}
        <button
          onClick={() => setLocation("/blog")}
          className="text-sm font-medium text-neutral-400 hover:text-[#0F0F10] transition-colors inline-flex items-center gap-2 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to blog
        </button>

        {/* Article Meta */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}
          >
            {article.category}
          </span>
          <span className="text-sm text-neutral-400">
            {article.date} &middot; {article.readTime} read
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-10 leading-tight">
          {article.title}
        </h1>

        {/* Article Body */}
        <article className="prose prose-neutral max-w-none text-[#0F0F10]/80 leading-relaxed space-y-6">
          <p className="text-lg">
            The landscape of digital discovery is undergoing its most
            significant transformation since the advent of search engines. As
            AI-powered platforms like ChatGPT, Gemini, and Perplexity become the
            primary interface between users and information, brands face a new
            challenge: ensuring they appear accurately and prominently in
            synthesized AI responses.
          </p>

          <p>
            Traditional SEO focused on ranking in a list of blue links. Answer
            Engine Optimization (AEO) requires a fundamentally different
            approach. Instead of competing for position on a results page,
            brands must compete for inclusion in a model's synthesized answer.
            This means optimizing for how AI models understand, summarize, and
            cite your content — not just whether your page appears in an index.
          </p>

          <p>
            The data tells a compelling story. Our analysis of over 50,000
            AI-generated responses shows that brands with structured,
            authoritative content are cited 3.2x more often than those relying
            solely on traditional SEO tactics. Moreover, the sentiment of AI
            mentions directly correlates with brand perception among users who
            increasingly trust AI summaries over individual search results.
          </p>

          <p>
            What makes this shift particularly important is the compounding
            nature of AI visibility. Models learn from patterns in data, and
            brands that establish strong citation patterns early create a
            self-reinforcing cycle: more citations lead to stronger model
            association, which leads to more prominent placement in future
            responses. Early movers in AEO are building moats that will be
            difficult to overcome.
          </p>

          <p>
            The actionable takeaway is clear: every brand with a digital
            presence needs to audit its AI visibility today. Understanding where
            you appear, how you're described, and what content gets cited is no
            longer optional — it's the foundation of modern brand strategy.
            Tools like bVisible make this process systematic, giving you the
            data you need to take control of your narrative in the age of
            AI-mediated discovery.
          </p>
        </article>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-[#E2E2E3]">
          <p className="text-sm font-semibold mb-4">Share this article</p>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-[#E2E2E3] rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
              <Twitter className="w-4 h-4" />
              Twitter
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-[#E2E2E3] rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
              <Link2 className="w-4 h-4" />
              Copy link
            </button>
          </div>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="mt-16 pt-8 border-t border-[#E2E2E3]">
            <h2 className="text-2xl font-bold mb-8">Related articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => {
                const relColors = CATEGORY_COLORS[rel.category];
                return (
                  <button
                    key={rel.slug}
                    onClick={() => setLocation(`/blog/${rel.slug}`)}
                    className="text-left group bg-white border border-[#E2E2E3] rounded-2xl p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${relColors.bg} ${relColors.text} mb-3`}
                    >
                      {rel.category}
                    </span>
                    <h3 className="text-sm font-bold mb-2 line-clamp-2 group-hover:text-neutral-700 transition-colors">
                      {rel.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>{rel.readTime} read</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-[#E2E2E3] bg-white text-[#0F0F10]">
        <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
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
