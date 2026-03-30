import { useLocation } from "wouter";
import { Check, X } from "lucide-react";

const features = [
  {
    feature: "AI Engines",
    bvisible: "5 (all with web search)",
    competitor: "ChatGPT, Perplexity, Gemini, Copilot",
  },
  {
    feature: "Daily Checks",
    bvisible: "Unlimited",
    competitor: "75 (starter)",
  },
  {
    feature: "Starting Price",
    bvisible: "Free audit / Pro from $79/mo",
    competitor: "$249+/mo (requires Ahrefs sub)",
  },
  { feature: "Team Seats", bvisible: "Unlimited", competitor: "Single seat" },
  { feature: "Sentiment Analysis", bvisible: true, competitor: false },
  { feature: "Prompt Tagging", bvisible: true, competitor: false },
  {
    feature: "Gap Analysis",
    bvisible: "Yes (one-click)",
    competitor: "Manual filters only",
  },
  { feature: "Competitor Gap Analysis", bvisible: true, competitor: false },
  {
    feature: "Data Export",
    bvisible: "Unlimited",
    competitor: "1,000 row limit",
  },
  {
    feature: "Free Trial",
    bvisible: "Free audit (no card)",
    competitor: "Limited demo",
  },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return <Check className="w-5 h-5 text-emerald-600 mx-auto" />;
  if (value === false)
    return <X className="w-5 h-5 text-neutral-300 mx-auto" />;
  return <span>{value}</span>;
}

export default function CompareAhrefsPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="bg-white text-[#0F0F10] min-h-screen">
      {/* Navigation */}
      <header className="w-full top-0 sticky z-50 bg-white/80 backdrop-blur-md border-b border-[#E2E2E3]/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
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
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <button
              onClick={() => setLocation("/blog")}
              className="text-sm font-medium text-[#0F0F10]/60 hover:text-[#0F0F10] transition-colors"
            >
              Blog
            </button>
            <button
              onClick={() => setLocation("/docs")}
              className="text-sm font-medium text-[#0F0F10]/60 hover:text-[#0F0F10] transition-colors"
            >
              Documentation
            </button>
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/login")}
              className="text-sm font-medium text-[#0F0F10]/60 hover:text-[#0F0F10] transition-colors px-4"
            >
              Log in
            </button>
            <button
              onClick={() => setLocation("/audit")}
              className="bg-[#0F0F10] text-white px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-all active:scale-95"
            >
              Start Audit
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section
          className="relative pt-24 pb-16 overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(24, 24, 27, 0.03) 0%, transparent 70%)",
          }}
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#0F0F10] mb-6 leading-[1.08]">
              bVisible vs Ahrefs Brand Radar:
              <br className="hidden md:block" /> An honest comparison
            </h1>
            <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
              Ahrefs Brand Radar brings massive prompt data to AI visibility.
              Here is how it stacks up against a dedicated monitoring platform.
            </p>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div
            className="rounded-2xl border border-[#E2E2E3] overflow-hidden"
            style={{
              boxShadow:
                "0 0 0 1px rgba(0,0,0,0.03), 0 8px 32px -8px rgba(0,0,0,0.08)",
            }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0F0F10] text-white">
                  <th className="text-left px-6 py-4 font-semibold">Feature</th>
                  <th className="text-center px-6 py-4 font-semibold">
                    bVisible
                  </th>
                  <th className="text-center px-6 py-4 font-semibold">
                    Ahrefs Brand Radar
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#F9F9FA]"}
                  >
                    <td className="px-6 py-4 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      <Cell value={row.bvisible} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Cell value={row.competitor} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Key Differences */}
        <section className="py-20 bg-[#F9F9FA]">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 text-center">
              Key Differences
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-xl font-bold mb-4">bVisible strengths</h3>
                <ul className="space-y-3 text-neutral-600">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />{" "}
                    Significantly lower price point ($79 vs $249+)
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />{" "}
                    Built-in sentiment analysis
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />{" "}
                    One-click gap analysis and competitor gaps
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />{" "}
                    Unlimited data exports with no row limits
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />{" "}
                    Free audit with no credit card required
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Ahrefs Brand Radar strengths
                </h3>
                <ul className="space-y-3 text-neutral-600">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />{" "}
                    250M+ prompt dataset for research
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />{" "}
                    Established brand with large user community
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />{" "}
                    Deep integration with Ahrefs SEO tools
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Verdict */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 text-center">
              Verdict
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-[#E2E2E3] p-8 bg-white">
                <h3 className="text-lg font-bold mb-4">
                  Choose bVisible if...
                </h3>
                <ul className="space-y-2 text-neutral-600 text-sm">
                  <li>
                    You want AI visibility without a $249+/mo Ahrefs
                    subscription
                  </li>
                  <li>Sentiment analysis matters to your brand monitoring</li>
                  <li>
                    You need automated gap analysis and competitor tracking
                  </li>
                  <li>Your team needs unlimited seats and data exports</li>
                  <li>
                    You prefer to start with a free audit before committing
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-[#E2E2E3] p-8 bg-white">
                <h3 className="text-lg font-bold mb-4">
                  Choose Ahrefs Brand Radar if...
                </h3>
                <ul className="space-y-2 text-neutral-600 text-sm">
                  <li>
                    You already pay for Ahrefs and want everything in one place
                  </li>
                  <li>You need access to a 250M+ prompt research database</li>
                  <li>
                    Backlink and SEO data alongside AI visibility is essential
                  </li>
                  <li>You track fewer than 75 prompts daily</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 bg-[#0F0F10] text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
              Try bVisible Free
            </h2>
            <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto">
              Run a free 10-prompt audit across 5 AI engines. No credit card
              required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setLocation("/audit")}
                className="bg-white text-black px-10 py-4 rounded-lg font-bold text-lg hover:bg-neutral-100 transition-all active:scale-95 shadow-xl shadow-white/5"
              >
                Start Free Audit
              </button>
              <button
                onClick={() => setLocation("/contact")}
                className="bg-transparent border border-white/20 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white/5 transition-colors active:scale-95"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 border-t border-[#E2E2E3] bg-white text-[#0F0F10]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="space-y-4">
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
              <p className="text-neutral-400 text-sm max-w-xs">
                Mission Control for AI Visibility. Deconstructing the synthesis
                of the next web.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16 font-mono text-[10px] uppercase tracking-[0.1em] text-neutral-400">
              <div className="flex flex-col gap-4">
                <span className="text-[#0F0F10] font-bold">Product</span>
                <a
                  className="hover:text-black transition-colors cursor-pointer"
                  href="/#features"
                >
                  Features
                </a>
                <a
                  className="hover:text-black transition-colors cursor-pointer"
                  onClick={() => setLocation("/docs")}
                >
                  Documentation
                </a>
                <a
                  className="hover:text-black transition-colors cursor-pointer"
                  onClick={() => setLocation("/docs/endpoints-overview")}
                >
                  API
                </a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[#0F0F10] font-bold">Company</span>
                <a
                  className="hover:text-black transition-colors cursor-pointer"
                  onClick={() => setLocation("/contact")}
                >
                  Contact
                </a>
                <a
                  className="hover:text-black transition-colors cursor-pointer"
                  onClick={() => setLocation("/blog")}
                >
                  Blog
                </a>
                <a
                  className="hover:text-black transition-colors cursor-pointer"
                  onClick={() => setLocation("/login")}
                >
                  Log in
                </a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[#0F0F10] font-bold">Legal</span>
                <a className="hover:text-black transition-colors" href="#">
                  Privacy
                </a>
                <a className="hover:text-black transition-colors" href="#">
                  Terms
                </a>
                <a className="hover:text-black transition-colors" href="#">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-[#E2E2E3] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
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
        </div>
      </footer>
    </div>
  );
}
