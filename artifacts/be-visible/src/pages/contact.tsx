import { useLocation } from "wouter";
import { Mail, Send } from "lucide-react";

export default function ContactPage() {
  const [, setLocation] = useLocation();
  return (
    <div className="bg-white text-[#0F0F10] min-h-screen">
      {/* Simple header */}
      <header className="w-full border-b border-[#E2E2E3]/50 bg-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/images/bvisible-logo.svg"
              alt="bVisible"
              className="h-8 w-8"
            />
            <img
              src="/images/bvisible-text.svg"
              alt="bVisible"
              className="h-4"
            />
          </a>
          <button
            onClick={() => setLocation("/")}
            className="text-sm text-neutral-500 hover:text-[#0F0F10]"
          >
            Back to home
          </button>
        </div>
      </header>

      {/* Hero section */}
      <section className="w-full border-b border-[#E2E2E3]/50 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-semibold tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            Have questions about bVisible? We'd love to hear from you. Reach out
            and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Two-column layout */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Contact info */}
          <div>
            <div className="border border-[#E2E2E3] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#0F0F10] flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Get in Touch
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-2">
                    Email
                  </p>
                  <a
                    href="mailto:piotrw.wasiluk@gmail.com"
                    className="text-[#0F0F10] font-medium hover:underline"
                  >
                    piotrw.wasiluk@gmail.com
                  </a>
                </div>

                <div className="h-px bg-[#E2E2E3]" />

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <p className="text-sm text-neutral-500">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact form */}
          <div>
            <div className="border border-[#E2E2E3] rounded-2xl p-8">
              <h2 className="text-xl font-semibold tracking-tight mb-6">
                Send a Message
              </h2>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 border border-[#E2E2E3] rounded-lg text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0F0F10]/10 focus:border-[#0F0F10]/30 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="you@company.com"
                    className="w-full px-4 py-2.5 border border-[#E2E2E3] rounded-lg text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0F0F10]/10 focus:border-[#0F0F10]/30 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="How can we help?"
                    className="w-full px-4 py-2.5 border border-[#E2E2E3] rounded-lg text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0F0F10]/10 focus:border-[#0F0F10]/30 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0F0F10] text-white text-sm font-medium rounded-lg cursor-not-allowed opacity-50 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-neutral-400 mt-12">
          Or reach out directly via email
        </p>
      </main>
    </div>
  );
}
