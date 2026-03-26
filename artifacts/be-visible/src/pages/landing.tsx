import { useLocation } from "wouter";
import { Network, SearchCheck, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="bg-white text-[#0F0F10] min-h-screen">
      {/* Navigation */}
      <header className="w-full top-0 sticky z-50 bg-white/80 backdrop-blur-md border-b border-[#E2E2E3]/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <img src="/images/bvisible-logo-v2.png" alt="bVisible logo" className="h-9 w-9 object-contain brightness-0" />
              <span className="font-bold tracking-tight text-base leading-none text-[#0F0F10]">
                b<span className="text-lg">V</span>isible
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a className="text-sm font-medium text-[#0F0F10]/60 hover:text-[#0F0F10] transition-colors" href="#features">Product</a>
              <a className="text-sm font-medium text-[#0F0F10]/60 hover:text-[#0F0F10] transition-colors" href="#">Pricing</a>
              <a className="text-sm font-medium text-[#0F0F10]/60 hover:text-[#0F0F10] transition-colors" href="#">Documentation</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/dashboard")}
              className="text-sm font-medium text-[#0F0F10]/60 hover:text-[#0F0F10] transition-colors px-4"
            >
              Log in
            </button>
            <button
              onClick={() => setLocation("/setup")}
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
          style={{ background: "radial-gradient(circle at 50% 0%, rgba(24, 24, 27, 0.03) 0%, transparent 70%)" }}
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#0F0F10] mb-8 leading-[1.05]">
              Track how AI models <br className="hidden md:block" /> see your brand.
            </h1>

            <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              The visibility layer for the agentic web. Surface where you appear, what content gets cited, and where competitors lead in AI synthesis.
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => setLocation("/setup")}
                className="px-8 py-4 bg-[#0F0F10] text-white font-bold rounded-lg transition-all active:scale-95 hover:shadow-lg hover:-translate-y-0.5"
              >
                Start Audit
              </button>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div
            className="rounded-2xl bg-neutral-50 border border-[#E2E2E3] overflow-hidden"
            style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.05), 0 20px 50px -12px rgba(0,0,0,0.1)" }}
          >
            {/* Mock Browser Chrome */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E2E2E3]">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-neutral-200" />
                <div className="w-3 h-3 rounded-full bg-neutral-200" />
                <div className="w-3 h-3 rounded-full bg-neutral-200" />
                <div className="h-4 w-32 bg-neutral-100 rounded ml-4" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-24 bg-neutral-50 border border-[#E2E2E3] rounded" />
                <div className="h-8 w-8 bg-[#0F0F10] rounded" />
              </div>
            </div>

            {/* Screenshot Preview */}
            <img
              src="/images/citations-preview.png"
              alt="Citation Intelligence dashboard"
              className="w-full block"
            />
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="py-24 bg-[#F9F9FA]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Turn AI Visibility into your unfair advantage
              </h2>
              <p className="text-neutral-500 max-w-2xl mx-auto">
                Move from guessing how LLMs see you to surgical narrative management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Network,
                  title: "Understand LLM Synthesis",
                  body: "Trace the lineage of how models arrive at brand descriptions. Identify which datasets influence your visibility most.",
                },
                {
                  icon: SearchCheck,
                  title: "Close the Topic Gap",
                  body: "Pinpoint high-intent clusters where competitors lead. Deploy content strategies specifically designed for model training pipelines.",
                },
                {
                  icon: ShieldCheck,
                  title: "Verify Citation Accuracy",
                  body: "Monitor and correct model hallucinations in real-time. Ensure your official documentation is the primary source of truth.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="group">
                  <div className="h-64 bg-white rounded-2xl border border-[#E2E2E3] p-6 transition-all hover:shadow-md flex flex-col">
                    <Icon className="w-9 h-9 mb-4 text-[#0F0F10]" strokeWidth={1.5} />
                    <h3 className="text-xl font-bold mb-3">{title}</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-[#0F0F10] text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
              Ready to audit your visibility?
            </h2>
            <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto">
              Join forward-thinking growth teams who have moved beyond traditional search and into the AI synthesis era.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setLocation("/setup")}
                className="bg-white text-black px-10 py-4 rounded-lg font-bold text-lg hover:bg-neutral-100 transition-all active:scale-95 shadow-xl shadow-white/5"
              >
                Start Audit
              </button>
              <button className="bg-transparent border border-white/20 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white/5 transition-colors active:scale-95">
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
              <div className="flex items-center gap-2">
                <img src="/images/bvisible-logo-v2.png" alt="bVisible logo" className="h-9 w-9 object-contain brightness-0" />
                <span className="font-bold tracking-tight text-base leading-none text-[#0F0F10]">
                  b<span className="text-lg">V</span>isible
                </span>
              </div>
              <p className="text-neutral-400 text-sm max-w-xs">
                Mission Control for AI Visibility. Deconstructing the synthesis of the next web.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16 font-mono text-[10px] uppercase tracking-[0.1em] text-neutral-400">
              <div className="flex flex-col gap-4">
                <span className="text-[#0F0F10] font-bold">Product</span>
                <a className="hover:text-black transition-colors" href="#features">Features</a>
                <a className="hover:text-black transition-colors" href="#">Pricing</a>
                <a className="hover:text-black transition-colors" href="#">API</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[#0F0F10] font-bold">Company</span>
                <a className="hover:text-black transition-colors" href="#">About</a>
                <a className="hover:text-black transition-colors" href="#">Blog</a>
                <a className="hover:text-black transition-colors" href="#">Careers</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[#0F0F10] font-bold">Legal</span>
                <a className="hover:text-black transition-colors" href="#">Privacy</a>
                <a className="hover:text-black transition-colors" href="#">Terms</a>
                <a className="hover:text-black transition-colors" href="#">Cookie Policy</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-[#E2E2E3] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
            <div>© 2026 bVisible. All rights reserved.</div>

            <div className="flex gap-6">
              <a className="hover:text-black transition-colors" href="#">Twitter</a>
              <a className="hover:text-black transition-colors" href="#">LinkedIn</a>
              <a className="hover:text-black transition-colors" href="#">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
