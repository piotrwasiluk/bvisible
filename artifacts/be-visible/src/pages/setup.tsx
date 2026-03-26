import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { useSaveWorkspace } from "@/hooks/use-workspace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { WorkspaceSetupInput } from "@workspace/api-client-react";

// Create Zod schema reflecting the OpenAPI input type
const setupSchema = z.object({
  brandName: z.string().min(2, "Brand name is required"),
  websiteUrl: z.string().url("Valid URL is required"),
  competitor1Url: z.string().url().optional().or(z.literal("")),
  competitor2Url: z.string().url().optional().or(z.literal("")),
  competitor3Url: z.string().url().optional().or(z.literal("")),
  region: z.string().default("us-en"),
  productCategories: z.string().optional(),
});

type SetupFormValues = z.infer<typeof setupSchema>;

export default function SetupPage() {
  const [, setLocation] = useLocation();
  const { mutate: createWorkspace, isPending } = useSaveWorkspace();

  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      brandName: "",
      websiteUrl: "",
      competitor1Url: "",
      competitor2Url: "",
      competitor3Url: "",
      region: "us-en",
      productCategories: "",
    },
  });

  const { watch, handleSubmit, formState: { errors } } = form;
  
  const values = watch();
  const hasIdentity = values.brandName.length > 2 && values.websiteUrl.includes(".");
  const hasCompetitors = !!values.competitor1Url;
  const hasCategories = !!values.productCategories;

  const onSubmit = (data: SetupFormValues) => {
    // Send directly to the generated hook (matches type WorkspaceSetupInput)
    createWorkspace(
      { data: data as WorkspaceSetupInput },
      {
        onSuccess: () => {
          setLocation("/dashboard");
        },
      }
    );
  };

  return (
    <div className="max-w-5xl w-full mx-auto px-6 py-12 md:py-20">
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-ring"></span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            Setup Phase 01
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-4">
          Set up your workspace
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl">
          Add your site, competitors, and focus areas to calibrate our AI engine for your first visibility audit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            
            {/* Section 01 */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                <span className="font-mono text-[11px] font-bold tracking-widest uppercase">01. Brand Identity</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Brand Name</label>
                  <Input placeholder="e.g. Acme Corp" {...form.register("brandName")} />
                  {errors.brandName && <p className="text-xs text-destructive">{errors.brandName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Website URL</label>
                  <Input placeholder="https://acme.com" type="url" {...form.register("websiteUrl")} />
                  {errors.websiteUrl && <p className="text-xs text-destructive">{errors.websiteUrl.message}</p>}
                </div>
              </div>
            </section>

            {/* Section 02 */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                <span className="font-mono text-[11px] font-bold tracking-widest uppercase">02. Competitive Landscape</span>
              </div>
              <div className="space-y-3">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Competitor Domains (Max 3)</label>
                <div className="space-y-3">
                  <Input placeholder="Competitor 1 URL" {...form.register("competitor1Url")} />
                  <Input placeholder="Competitor 2 URL" {...form.register("competitor2Url")} />
                  <Input placeholder="Competitor 3 URL" {...form.register("competitor3Url")} />
                </div>
              </div>
            </section>

            {/* Section 03 */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                <span className="font-mono text-[11px] font-bold tracking-widest uppercase">03. Audit Calibration</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Region / Language</label>
                  <select 
                    {...form.register("region")}
                    className="flex h-11 w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-sm border border-transparent ring-1 ring-border/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
                  >
                    <option value="us-en">United States (EN)</option>
                    <option value="uk-en">United Kingdom (EN)</option>
                    <option value="de-de">Germany (DE)</option>
                    <option value="fr-fr">France (FR)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Product Categories</label>
                  <Input placeholder="e.g. SaaS, Enterprise Security" {...form.register("productCategories")} />
                </div>
              </div>
            </section>

            <div className="pt-8 flex items-center justify-between gap-4">
              <Button type="submit" size="lg" disabled={isPending} className="font-mono uppercase tracking-widest text-xs group">
                {isPending ? "Calibrating..." : "Launch First Audit"}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="font-mono text-xs text-muted-foreground hidden sm:block">Estimated calibration time: 140s</p>
            </div>
          </form>
        </div>

        {/* Right Status Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low rounded-xl p-6 border border-border/40">
            <h3 className="font-mono text-[10px] font-bold text-muted-foreground mb-6 uppercase tracking-widest">
              Workspace Health
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Domain Validation</span>
                {hasIdentity ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-border border-dashed" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Competitive Scope</span>
                {hasCompetitors ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-border border-dashed" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Topic Taxonomy</span>
                {hasCategories ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-border border-dashed" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Regional Servers</span>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-border/40 rounded text-foreground font-bold">READY</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-[11px] leading-relaxed text-muted-foreground italic">
                "Our mission control protocol ensures high-fidelity data extraction by mapping your digital footprint against regional search intent patterns."
              </p>
            </div>
          </div>

          {/* Decorative graphic matching spec */}
          <div className="relative h-48 w-full rounded-xl overflow-hidden bg-zinc-950 border border-border/30">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-700 to-transparent mix-blend-screen"></div>
            <img 
              src={`${import.meta.env.BASE_URL}images/data-engine-viz.png`} 
              alt="Data Engine Visualization" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 grayscale contrast-125"
            />
            <div className="absolute bottom-4 left-4">
              <span className="font-mono text-[9px] text-white/50 block tracking-widest mb-1">DATA ENGINE v4.2</span>
              <span className="text-white text-xs font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                Calibrating global sensors...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
