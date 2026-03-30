import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Globe,
  ArrowRight,
  Loader2,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  Circle,
  Zap,
  PartyPopper,
  Lock,
  Pencil,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "input" | "prompts" | "running" | "complete";

interface GeneratedPrompt {
  id: number;
  text: string;
}

const MAX_FREE_PROMPTS = 10;

const PLATFORMS = [
  { name: "OpenAI", color: "#10a37f", delay: 0 },
  { name: "Gemini", color: "#4285f4", delay: 1.5 },
  { name: "Perplexity", color: "#20808d", delay: 3 },
  { name: "Claude", color: "#d97706", delay: 4.5 },
  { name: "Google AI Mode", color: "#ea4335", delay: 6 },
];

function PageShell({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  return (
    <div className="bg-white text-[#0F0F10] min-h-screen">
      <header className="w-full border-b border-[#E2E2E3]/50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
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
            className="text-sm text-neutral-500 hover:text-[#0F0F10] transition-colors"
          >
            Back to home
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}

function StepIndicator({ current }: { current: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "input", label: "Website" },
    { key: "prompts", label: "Prompts" },
    { key: "running", label: "Analysis" },
    { key: "complete", label: "Done" },
  ];

  const currentIdx = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-center gap-2 mb-12">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              i === currentIdx
                ? "bg-[#0F0F10] text-white"
                : i < currentIdx
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-neutral-100 text-neutral-400"
            }`}
          >
            {i < currentIdx ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <span className="w-4 text-center">{i + 1}</span>
            )}
            {step.label}
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-8 h-px ${i < currentIdx ? "bg-emerald-300" : "bg-neutral-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function StepInput({
  onGenerate,
}: {
  onGenerate: (url: string, brand: string) => void;
}) {
  const [url, setUrl] = useState("");
  const [brand, setBrand] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!url) return;
    let fullUrl = url;
    if (!fullUrl.startsWith("http")) fullUrl = `https://${fullUrl}`;

    try {
      new URL(fullUrl);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/audit/generate-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteUrl: fullUrl,
          brandName: brand || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to generate prompts");
      }

      const data = await res.json();
      onGenerate(fullUrl, data.brandName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-xl mx-auto text-center"
    >
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-full text-xs font-medium text-neutral-500 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Free AI Visibility Audit
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Audit your AI visibility
        </h1>
        <p className="text-neutral-500 text-lg">
          Enter your website and we'll analyze how AI models see your brand
          across 5 platforms.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yourcompany.com"
              className="w-full pl-12 pr-4 py-4 text-lg border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F0F10]/20 focus:border-[#0F0F10] transition-all"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        <div>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Brand name (optional — we'll detect it)"
            className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F0F10]/10 focus:border-neutral-400 transition-all"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !url}
          className="w-full py-4 bg-[#0F0F10] text-white font-bold rounded-xl text-lg hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing your website...
            </>
          ) : (
            <>
              Analyze
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      <p className="mt-6 text-xs text-neutral-400">
        No credit card required. Get results in under 2 minutes.
      </p>
    </motion.div>
  );
}

function StepPrompts({
  prompts,
  brandName,
  onUpdatePrompts,
  onRun,
}: {
  prompts: GeneratedPrompt[];
  brandName: string;
  onUpdatePrompts: (prompts: GeneratedPrompt[]) => void;
  onRun: () => void;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const updateText = (id: number, text: string) => {
    onUpdatePrompts(prompts.map((p) => (p.id === id ? { ...p, text } : p)));
  };

  const deletePrompt = (id: number) => {
    onUpdatePrompts(prompts.filter((p) => p.id !== id));
  };

  const addPrompt = () => {
    if (prompts.length >= MAX_FREE_PROMPTS) return;
    const newId = Math.max(0, ...prompts.map((p) => p.id)) + 1;
    onUpdatePrompts([...prompts, { id: newId, text: "" }]);
    setEditingId(newId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Review your audit prompts
        </h2>
        <p className="text-neutral-500">
          These are the questions we'll ask AI models about{" "}
          <span className="font-medium text-[#0F0F10]">{brandName}</span>. Edit
          or add your own.
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Lock className="w-3.5 h-3.5" />
          Free Audit: {prompts.length}/{MAX_FREE_PROMPTS} prompts
        </div>
        <span className="text-[10px] text-neutral-400">
          Need more?{" "}
          <span className="text-[#0F0F10] font-medium">Upgrade to Pro</span> for
          unlimited prompts
        </span>
      </div>

      <div className="space-y-2 mb-6">
        {prompts.map((prompt, idx) => (
          <div
            key={prompt.id}
            className="group flex items-start gap-3 p-3 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors"
          >
            <span className="font-mono text-xs text-neutral-400 mt-2.5 w-5 shrink-0">
              {idx + 1}.
            </span>
            {editingId === prompt.id ? (
              <input
                autoFocus
                value={prompt.text}
                onChange={(e) => updateText(prompt.id, e.target.value)}
                onBlur={() => setEditingId(null)}
                onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                className="flex-1 text-sm py-1.5 px-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F0F10]/10"
                placeholder="Type your prompt..."
              />
            ) : (
              <span
                className="flex-1 text-sm py-1.5 cursor-pointer hover:text-neutral-600"
                onClick={() => setEditingId(prompt.id)}
              >
                {prompt.text || (
                  <span className="text-neutral-400 italic">
                    Click to edit...
                  </span>
                )}
              </span>
            )}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditingId(prompt.id)}
                className="p-1.5 text-neutral-400 hover:text-[#0F0F10] rounded-lg hover:bg-neutral-100"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deletePrompt(prompt.id)}
                className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {prompts.length < MAX_FREE_PROMPTS && (
        <button
          onClick={addPrompt}
          className="w-full py-3 border border-dashed border-neutral-300 rounded-xl text-sm text-neutral-500 hover:border-neutral-400 hover:text-[#0F0F10] transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add prompt
        </button>
      )}

      <button
        onClick={onRun}
        disabled={prompts.filter((p) => p.text.trim()).length === 0}
        className="w-full mt-8 py-4 bg-[#0F0F10] text-white font-bold rounded-xl text-lg hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Zap className="w-5 h-5" />
        Run Audit
      </button>
    </motion.div>
  );
}

function StepRunning({ onComplete }: { onComplete: () => void }) {
  const [completedPlatforms, setCompletedPlatforms] = useState<string[]>([]);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    // Simulate platform completion with staggered timings
    // In production this would poll /api/audit/status
    const timers = PLATFORMS.map((platform, i) =>
      setTimeout(
        () => {
          setCompletedPlatforms((prev) => [...prev, platform.name]);
        },
        (platform.delay + 2) * 1000,
      ),
    );

    // Also poll the real status endpoint
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/audit/status");
        const data = await res.json();
        if (!data.running) {
          setPolling(false);
          clearInterval(pollInterval);
        }
      } catch {
        // ignore polling errors
      }
    }, 3000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(pollInterval);
    };
  }, []);

  // Complete when all platforms are "done" (either real or simulated)
  useEffect(() => {
    if (completedPlatforms.length >= PLATFORMS.length) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [completedPlatforms, onComplete]);

  const progress = (completedPlatforms.length / PLATFORMS.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-lg mx-auto text-center"
    >
      <h2 className="text-2xl font-bold tracking-tight mb-2">
        Running your audit
      </h2>
      <p className="text-neutral-500 mb-10">
        Querying AI models with your prompts. This usually takes 1-2 minutes.
      </p>

      {/* Progress bar */}
      <div className="w-full h-2 bg-neutral-100 rounded-full mb-10 overflow-hidden">
        <motion.div
          className="h-full bg-[#0F0F10] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Platform status list */}
      <div className="space-y-4">
        {PLATFORMS.map((platform) => {
          const isDone = completedPlatforms.includes(platform.name);
          const isActive =
            !isDone &&
            completedPlatforms.length ===
              PLATFORMS.findIndex((p) => p.name === platform.name);

          return (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: isDone || isActive ? 1 : 0.4 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                style={{ backgroundColor: platform.color }}
              >
                {platform.name.charAt(0)}
              </div>
              <span className="flex-1 text-left font-medium text-sm">
                {platform.name}
              </span>
              {isDone ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </motion.div>
              ) : isActive ? (
                <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />
              ) : (
                <Circle className="w-5 h-5 text-neutral-200" />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function StepComplete() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/overview");
    }, 3000);
    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
        className="mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100">
          <PartyPopper className="w-10 h-10 text-emerald-600" />
        </div>
      </motion.div>

      <h2 className="text-3xl font-bold tracking-tight mb-4">
        Audit Complete!
      </h2>
      <p className="text-neutral-500 text-lg mb-8">
        Your AI visibility dashboard is ready. Redirecting you now...
      </p>

      <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading your dashboard...
      </div>
    </motion.div>
  );
}

export default function AuditPage() {
  const [step, setStep] = useState<Step>("input");
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [brandName, setBrandName] = useState("");
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);

  const handleGenerated = useCallback(async (url: string, brand: string) => {
    setBrandName(brand);

    // Fetch the generated prompts from the server
    try {
      const res = await fetch("/api/prompts?limit=10");
      const data = await res.json();
      if (data.items) {
        setPrompts(
          data.items.map((p: { id: number; text: string }) => ({
            id: p.id,
            text: p.text,
          })),
        );
      }
    } catch {
      // Prompts were already saved by generate-prompts, just show what we have
    }

    setStep("prompts");
  }, []);

  const handleRun = useCallback(async () => {
    setStep("running");

    try {
      await fetch("/api/audit/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId: workspaceId || undefined }),
      });
    } catch {
      // Analysis started in background, continue to progress screen
    }
  }, [workspaceId]);

  const handleComplete = useCallback(() => {
    setStep("complete");
  }, []);

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <StepIndicator current={step} />

        <AnimatePresence mode="wait">
          {step === "input" && (
            <StepInput key="input" onGenerate={handleGenerated} />
          )}
          {step === "prompts" && (
            <StepPrompts
              key="prompts"
              prompts={prompts}
              brandName={brandName}
              onUpdatePrompts={setPrompts}
              onRun={handleRun}
            />
          )}
          {step === "running" && (
            <StepRunning key="running" onComplete={handleComplete} />
          )}
          {step === "complete" && <StepComplete key="complete" />}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
