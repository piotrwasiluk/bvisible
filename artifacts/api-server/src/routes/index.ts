import { Router, type IRouter } from "express";
import healthRouter from "./health";
import workspaceRouter from "./workspace";
import analyticsRouter from "./analytics";
import promptsRouter from "./prompts-route";
import pagesRouter from "./pages-route";
import citationsRouter from "./citations-route";
import reportsRouter from "./reports-route";
import filtersRouter from "./filters";
import analysisRouter from "./analysis";
import auditRouter from "./audit";

const router: IRouter = Router();

router.use(healthRouter);
router.use(workspaceRouter);
router.use(analyticsRouter);
router.use(promptsRouter);
router.use(pagesRouter);
router.use(citationsRouter);
router.use(reportsRouter);
router.use(filtersRouter);
router.use(analysisRouter);
router.use(auditRouter);

export default router;
