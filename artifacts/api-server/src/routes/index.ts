import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import candidatesRouter from "./candidates";
import notesRouter from "./notes";
import dashboardRouter from "./dashboard";
import activityRouter from "./activity";
import kanbanRouter from "./kanban";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(candidatesRouter);
router.use(notesRouter);
router.use(dashboardRouter);
router.use(activityRouter);
router.use(kanbanRouter);

export default router;
