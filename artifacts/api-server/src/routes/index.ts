import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import arbitrumRouter from "./arbitrum.js";
import agentRouter from "./agent.js";
import mcpRouter from "./mcp.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(arbitrumRouter);
router.use(agentRouter);
router.use(mcpRouter);

export default router;
