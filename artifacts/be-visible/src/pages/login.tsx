import { useLocation } from "wouter";

export default function LoginPage() {
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

      {/* Page content */}
      <main className="flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="border border-[#E2E2E3] rounded-2xl p-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2">
                <img
                  src="/images/bvisible-logo.svg"
                  alt="bVisible"
                  className="h-10 w-10"
                />
                <img
                  src="/images/bvisible-text.svg"
                  alt="bVisible"
                  className="h-5"
                />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-semibold text-center mb-8 tracking-tight">
              Sign in to bVisible
            </h1>

            {/* Google sign-in */}
            <div className="relative group">
              <button
                disabled
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#E2E2E3] rounded-lg text-sm font-medium text-neutral-400 cursor-not-allowed hover:border-[#E2E2E3] transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#9CA3AF"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#9CA3AF"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#9CA3AF"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#9CA3AF"
                  />
                </svg>
                Sign in with Google
              </button>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0F0F10] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Coming soon
              </span>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#E2E2E3]" />
              <span className="text-xs text-neutral-400 uppercase tracking-widest">
                or
              </span>
              <div className="flex-1 h-px bg-[#E2E2E3]" />
            </div>

            {/* Email / Password form */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="w-full px-4 py-2.5 border border-[#E2E2E3] rounded-lg text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0F0F10]/10 focus:border-[#0F0F10]/30 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1.5"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-[#E2E2E3] rounded-lg text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0F0F10]/10 focus:border-[#0F0F10]/30 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled
                className="w-full px-4 py-3 bg-[#0F0F10] text-white text-sm font-medium rounded-lg cursor-not-allowed opacity-50 transition-colors"
              >
                Sign in
              </button>
            </form>

            {/* Sign up link */}
            <p className="text-center text-sm text-neutral-500 mt-6">
              Don't have an account?{" "}
              <button
                onClick={() => setLocation("/audit")}
                className="text-[#0F0F10] font-medium hover:underline"
              >
                Start a free audit
              </button>
            </p>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-neutral-400 mt-6">
            OAuth integration coming soon
          </p>
        </div>
      </main>
    </div>
  );
}
