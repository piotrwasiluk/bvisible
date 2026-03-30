import { Router, type IRouter } from "express";
import {
  runDailyAnalysis,
  isAnalysisRunning,
  setRunning,
} from "@workspace/ai-engine";

const router: IRouter = Router();

router.post("/analysis/run", async (_req, res) => {
  if (isAnalysisRunning()) {
    res.status(409).json({
      error: "conflict",
      message: "Analysis is already running",
    });
    return;
  }

  // Start analysis in background so the HTTP response returns immediately
  setRunning(true);

  runDailyAnalysis()
    .then((result: { successes: number; failures: number }) => {
      console.log(
        `[Manual Run] Completed: ${result.successes} successes, ${result.failures} failures`,
      );
    })
    .catch((err: unknown) => {
      console.error("[Manual Run] Failed:", err);
    })
    .finally(() => {
      setRunning(false);
    });

  res.json({
    status: "started",
    message:
      "Analysis started in the background. Check server logs for progress.",
  });
});

router.get("/analysis/status", async (_req, res) => {
  res.json({
    running: isAnalysisRunning(),
  });
});

export default router;
