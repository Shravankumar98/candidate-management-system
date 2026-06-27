import { Router, type IRouter } from "express";
import { eq, ilike, and, or, desc, asc, count } from "drizzle-orm";
import { db, candidatesTable, notesTable, activityLogsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/requireAuth";
import {
  ListCandidatesQueryParams,
  CreateCandidateBody,
  GetCandidateParams,
  UpdateCandidateParams,
  UpdateCandidateBody,
  DeleteCandidateParams,
  UpdateCandidateStatusParams,
  UpdateCandidateStatusBody,
  ListCandidateNotesParams,
  CreateCandidateNoteParams,
  CreateCandidateNoteBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/candidates", requireAuth, async (req, res): Promise<void> => {
  const parsed = ListCandidatesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { page, limit, search, status, sortBy, sortOrder } = parsed.data;
  const offset = ((page ?? 1) - 1) * (limit ?? 20);
  const pageLimit = limit ?? 20;

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        ilike(candidatesTable.name, `%${search}%`),
        ilike(candidatesTable.email, `%${search}%`),
        ilike(candidatesTable.currentCompany, `%${search}%`),
        ilike(candidatesTable.position, `%${search}%`),
      ),
    );
  }
  if (status) {
    conditions.push(eq(candidatesTable.status, status));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const sortColumn =
    sortBy === "name"
      ? candidatesTable.name
      : sortBy === "updatedAt"
        ? candidatesTable.updatedAt
        : sortBy === "yearsOfExperience"
          ? candidatesTable.yearsOfExperience
          : candidatesTable.createdAt;

  const orderFn = sortOrder === "asc" ? asc : desc;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(candidatesTable)
      .where(where)
      .orderBy(orderFn(sortColumn))
      .limit(pageLimit)
      .offset(offset),
    db.select({ total: count() }).from(candidatesTable).where(where),
  ]);

  const totalNum = Number(total);
  res.json({
    data: rows.map(serializeCandidate),
    total: totalNum,
    page: page ?? 1,
    limit: pageLimit,
    totalPages: Math.ceil(totalNum / pageLimit),
  });
});

router.post("/candidates", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateCandidateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { skills, status, ...rest } = parsed.data;
  const [candidate] = await db
    .insert(candidatesTable)
    .values({ ...rest, skills: skills ?? [], status: status ?? "applied" })
    .returning();

  await db.insert(activityLogsTable).values({
    candidateId: candidate.id,
    candidateName: candidate.name,
    action: "Candidate added",
    newValue: candidate.status,
  });

  res.status(201).json(serializeCandidate(candidate));
});

router.get("/candidates/:id", requireAuth, async (req, res): Promise<void> => {
  const params = GetCandidateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [candidate] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, params.data.id));

  if (!candidate) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }

  const [notes, activityLogs] = await Promise.all([
    db
      .select()
      .from(notesTable)
      .where(eq(notesTable.candidateId, candidate.id))
      .orderBy(desc(notesTable.createdAt)),
    db
      .select()
      .from(activityLogsTable)
      .where(eq(activityLogsTable.candidateId, candidate.id))
      .orderBy(desc(activityLogsTable.createdAt)),
  ]);

  res.json({
    ...serializeCandidate(candidate),
    notes: notes.map(serializeNote),
    activityLogs: activityLogs.map(serializeActivity),
  });
});

router.patch("/candidates/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateCandidateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCandidateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, params.data.id));

  if (!existing) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }

  const [candidate] = await db
    .update(candidatesTable)
    .set(parsed.data)
    .where(eq(candidatesTable.id, params.data.id))
    .returning();

  if (parsed.data.status && parsed.data.status !== existing.status) {
    await db.insert(activityLogsTable).values({
      candidateId: candidate.id,
      candidateName: candidate.name,
      action: "Status changed",
      oldValue: existing.status,
      newValue: parsed.data.status,
    });
  } else if (parsed.data.name || parsed.data.email) {
    await db.insert(activityLogsTable).values({
      candidateId: candidate.id,
      candidateName: candidate.name,
      action: "Profile updated",
    });
  }

  res.json(serializeCandidate(candidate));
});

router.delete("/candidates/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteCandidateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [candidate] = await db
    .delete(candidatesTable)
    .where(eq(candidatesTable.id, params.data.id))
    .returning();

  if (!candidate) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }

  res.sendStatus(204);
});

router.patch("/candidates/:id/status", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateCandidateStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCandidateStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, params.data.id));

  if (!existing) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }

  const [candidate] = await db
    .update(candidatesTable)
    .set({ status: parsed.data.status })
    .where(eq(candidatesTable.id, params.data.id))
    .returning();

  await db.insert(activityLogsTable).values({
    candidateId: candidate.id,
    candidateName: candidate.name,
    action: "Status changed",
    oldValue: existing.status,
    newValue: parsed.data.status,
  });

  res.json(serializeCandidate(candidate));
});

router.get("/candidates/:candidateId/notes", requireAuth, async (req, res): Promise<void> => {
  const params = ListCandidateNotesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const notes = await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.candidateId, params.data.candidateId))
    .orderBy(desc(notesTable.createdAt));

  res.json(notes.map(serializeNote));
});

router.post("/candidates/:candidateId/notes", requireAuth, async (req, res): Promise<void> => {
  const params = CreateCandidateNoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = CreateCandidateNoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [candidate] = await db
    .select()
    .from(candidatesTable)
    .where(eq(candidatesTable.id, params.data.candidateId));

  if (!candidate) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }

  const [note] = await db
    .insert(notesTable)
    .values({
      candidateId: params.data.candidateId,
      content: parsed.data.content,
      authorName: parsed.data.authorName,
    })
    .returning();

  await db.insert(activityLogsTable).values({
    candidateId: candidate.id,
    candidateName: candidate.name,
    action: `Note added by ${parsed.data.authorName}`,
  });

  res.status(201).json(serializeNote(note));
});

export function serializeCandidate(c: typeof candidatesTable.$inferSelect) {
  return {
    ...c,
    skills: c.skills ?? [],
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export function serializeNote(n: typeof notesTable.$inferSelect) {
  return {
    ...n,
    createdAt: n.createdAt.toISOString(),
    updatedAt: n.updatedAt.toISOString(),
  };
}

export function serializeActivity(a: typeof activityLogsTable.$inferSelect) {
  return {
    ...a,
    createdAt: a.createdAt.toISOString(),
  };
}

export default router;
