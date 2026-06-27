import { Router, type IRouter } from "express";
import { asc } from "drizzle-orm";
import { db, candidatesTable } from "@workspace/db";
import { requireAuth } from "../middlewares/requireAuth";

const KANBAN_STATUSES = [
  "applied",
  "screening",
  "interview",
  "offer",
  "selected",
  "rejected",
] as const;

const router: IRouter = Router();

router.get("/kanban", requireAuth, async (_req, res): Promise<void> => {
  const candidates = await db
    .select()
    .from(candidatesTable)
    .orderBy(asc(candidatesTable.createdAt));

  const grouped: Record<string, typeof candidates> = {
    applied: [],
    screening: [],
    interview: [],
    offer: [],
    selected: [],
    rejected: [],
  };

  for (const c of candidates) {
    if (c.status in grouped) {
      grouped[c.status].push(c);
    }
  }

  const columns = KANBAN_STATUSES.map((status) => ({
    status,
    candidates: grouped[status].map((c) => ({
      ...c,
      skills: c.skills ?? [],
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    })),
  }));

  res.json({ columns });
});

export default router;
