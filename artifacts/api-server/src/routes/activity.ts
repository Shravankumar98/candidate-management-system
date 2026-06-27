import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, activityLogsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/requireAuth";
import { ListActivityQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/activity", requireAuth, async (req, res): Promise<void> => {
  const parsed = ListActivityQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { limit, candidateId } = parsed.data;

  const logs = candidateId
    ? await db
        .select()
        .from(activityLogsTable)
        .where(eq(activityLogsTable.candidateId, candidateId))
        .orderBy(desc(activityLogsTable.createdAt))
        .limit(limit ?? 20)
    : await db
        .select()
        .from(activityLogsTable)
        .orderBy(desc(activityLogsTable.createdAt))
        .limit(limit ?? 20);

  res.json(
    logs.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    })),
  );
});

export default router;
