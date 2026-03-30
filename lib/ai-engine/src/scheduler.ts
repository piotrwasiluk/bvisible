import cron from "node-cron";
import { runDailyAnalysis } from "./engine.js";

let isRunning = false;

/**
 * Start the daily analysis cron job.
 * Runs at 2:00 AM UTC every day.
 */
export function startScheduler(): void {
  cron.schedule("0 2 * * *", async () => {
    if (isRunning) {
      console.log("[Scheduler] Analysis already running, skipping.");
      return;
    }

    isRunning = true;
    console.log("[Scheduler] Starting daily analysis...");

    try {
      const result = await runDailyAnalysis();
      console.log(
        `[Scheduler] Completed: ${result.successes} successes, ${result.failures} failures across ${result.platforms.length} platforms.`,
      );
    } catch (err) {
      console.error("[Scheduler] Daily analysis failed:", err);
    } finally {
      isRunning = false;
    }
  });

  console.log("[Scheduler] Daily analysis cron scheduled (2:00 AM UTC).");
}

/**
 * Check if an analysis run is currently in progress.
 */
export function isAnalysisRunning(): boolean {
  return isRunning;
}

/**
 * Set the running flag (used by manual trigger).
 */
export function setRunning(value: boolean): void {
  isRunning = value;
}
