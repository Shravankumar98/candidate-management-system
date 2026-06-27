import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, candidatesTable, activityLogsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/dashboard", requireAuth, async (_req, res): Promise<void> => {
  const [allCandidates, recentCandidates, recentActivity] = await Promise.all([
    db.select({ status: candidatesTable.status, id: candidatesTable.id }).from(candidatesTable),
    db.select().from(candidatesTable).orderBy(desc(candidatesTable.createdAt)).limit(5),
    db.select().from(activityLogsTable).orderBy(desc(activityLogsTable.createdAt)).limit(10),
  ]);

  const byStatus: Record<string, number> = {
    applied: 0,
    screening: 0,
    interview: 0,
    offer: 0,
    selected: 0,
    rejected: 0,
  };

  for (const c of allCandidates) {
    if (c.status in byStatus) {
      byStatus[c.status]++;
    }
  }

  res.json({
    totalCandidates: allCandidates.length,
    byStatus,
    recentCandidates: recentCandidates.map((c) => ({
      ...c,
      skills: c.skills ?? [],
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    })),
    recentActivity: recentActivity.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    })),
  });
});

export default router;
