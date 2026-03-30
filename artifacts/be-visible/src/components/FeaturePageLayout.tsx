import { useState } from "react";
import { useLocation } from "wouter";
import {
  Eye,
  Quote,
  Heart,
  Users,
  Lightbulb,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FeaturePageProps {
  platform: string;
  heroTitle: string;
  heroSubtitle: string;
  faqs: FAQItem[];
}

const featureCards: { icon: LucideIcon; title: string; description: string }[] =
  [
    {
      icon: Eye,
      title: "Brand Mention Tracking",
      description:
        "Monitor every time your brand is mentioned in AI-generated responses. Track frequency, context, and positioning across thousands of prompts.",
    },
    {
      icon: Quote,
      title: "Citation Intelligence",
      description:
        "See which of your pages get cited as sources. Understand what content AI models trust and reference when discussing your industry.",
    },
    {
      icon: Heart,
      title: "Sentiment Analysis",
      description:
        "Measure how positively or negatively AI models describe your brand. Track sentiment trends over time and compare against competitors.",
    },
    {
      icon: Users,
      title: "Competitive Benchmarking",
      description:
        "See how your visibility stacks up against competitors. Identify gaps where rivals are being recommended instead of you.",
    },
    {
      icon: Lightbulb,
      title: "Actionable Recommendations",
      description:
        "Get specific, prioritized actions to improve your AI visibility. Every recommendation is tied to data from real AI responses.",
    },
  ];

function FAQSection({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="border border-[#E2E2E3] rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-neutral-50 transition-colors"
          >
            <span className="font-semibold text-[#0F0F10]">{faq.question}</span>
            <ChevronDown
              className={`w-5 h-5 text-neutral-400 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
            />
          </button>
          {openIndex === i && (
            <div className="px-6 pb-5 text-neutral-500 leading-relaxed">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function FeaturePageLayout({
  platform,
  heroTitle,
  heroSubtitle,
  faqs,
}: FeaturePageProps) {
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
        {/* Hero Section */}
        <section
          className="relative pt-24 pb-16 overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(24, 24, 27, 0.03) 0%, transparent 70%)",
          }}
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#0F0F10] mb-8 leading-[1.05]">
              {heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              {heroSubtitle}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setLocation("/audit")}
                className="px-8 py-4 bg-[#0F0F10] text-white font-bold rounded-lg transition-all active:scale-95 hover:shadow-lg hover:-translate-y-0.5"
              >
                Start Free Audit
              </button>
            </div>
          </div>
        </section>

        {/* Trust Line */}
        <section className="py-8 text-center">
          <p className="text-sm font-medium text-neutral-400 uppercase tracking-[0.15em]">
            Trusted by growth teams worldwide
          </p>
        </section>

        {/* Feature Cards */}
        <section className="py-24 bg-[#F9F9FA]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featureCards
                .slice(0, 3)
                .map(({ icon: Icon, title, description }) => (
                  <div key={title} className="group">
                    <div className="h-64 bg-white rounded-2xl border border-[#E2E2E3] p-6 transition-all hover:shadow-md flex flex-col">
                      <Icon
                        className="w-9 h-9 mb-4 text-[#0F0F10]"
                        strokeWidth={1.5}
                      />
                      <h3 className="text-xl font-bold mb-3">{title}</h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-5xl mx-auto">
              {featureCards
                .slice(3)
                .map(({ icon: Icon, title, description }) => (
                  <div key={title} className="group">
                    <div className="h-64 bg-white rounded-2xl border border-[#E2E2E3] p-6 transition-all hover:shadow-md flex flex-col">
                      <Icon
                        className="w-9 h-9 mb-4 text-[#0F0F10]"
                        strokeWidth={1.5}
                      />
                      <h3 className="text-xl font-bold mb-3">{title}</h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Data to Action Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-6">
              From Data to Action
            </h2>
            <p className="text-neutral-500 text-center max-w-2xl mx-auto mb-16">
              bVisible connects the dots between what AI models say about you
              and what you can do about it.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#F9F9FA] border border-[#E2E2E3] flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-[#0F0F10]">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Earned</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Track organic mentions, citations, and recommendations your
                  brand earns across AI platforms without any paid promotion.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#F9F9FA] border border-[#E2E2E3] flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-[#0F0F10]">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Owned</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Understand which of your owned content -- blog posts, docs,
                  product pages -- gets cited as authoritative sources by AI
                  models.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#F9F9FA] border border-[#E2E2E3] flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-[#0F0F10]">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Impact</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Measure the real business impact of your AI visibility with
                  actionable metrics that tie directly to growth and revenue.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-platform Note */}
        <section className="py-16 bg-[#F9F9FA]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-lg md:text-xl font-semibold text-[#0F0F10]">
              Track across all AI engines from one dashboard
            </p>
            <p className="text-neutral-500 mt-3">
              ChatGPT, Gemini, Claude, Perplexity, and more -- all in a single
              view.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-16">
              Frequently Asked Questions
            </h2>
            <FAQSection faqs={faqs} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-[#0F0F10] text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
              Ready to track your {platform} visibility?
            </h2>
            <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto">
              Join forward-thinking growth teams who have moved beyond
              traditional search and into the AI synthesis era.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setLocation("/audit")}
                className="bg-white text-black px-10 py-4 rounded-lg font-bold text-lg hover:bg-neutral-100 transition-all active:scale-95 shadow-xl shadow-white/5"
              >
                Start Audit
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
                  href="#features"
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
            <div>© 2026 bVisible. All rights reserved.</div>
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
