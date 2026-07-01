import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import Candidate from "../models/Candidate";

const KANBAN_STATUSES = [
  "applied",
  "screening",
  "interview",
  "offer",
  "selected",
  "rejected",
] as const;

const router: IRouter = Router();

function serializeCandidate(candidate: any) {
  return {
    id: candidate._id.toString(),
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone,
    currentCompany: candidate.currentCompany,
    position: candidate.position,
    yearsOfExperience: candidate.yearsOfExperience,
    resumeUrl: candidate.resumeUrl,
    skills: candidate.skills ?? [],
    status: candidate.status,
    createdAt: candidate.createdAt.toISOString(),
    updatedAt: candidate.updatedAt.toISOString(),
  };
}

router.get("/kanban", requireAuth, async (_req, res): Promise<void> => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: 1 });

    const grouped: Record<string, any[]> = {
      applied: [],
      screening: [],
      interview: [],
      offer: [],
      selected: [],
      rejected: [],
    };

    for (const candidate of candidates) {
      if (candidate.status in grouped) {
        grouped[candidate.status].push(serializeCandidate(candidate));
      }
    }

    const columns = KANBAN_STATUSES.map((status) => ({
      status,
      candidates: grouped[status],
    }));

    res.json({ columns });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load kanban board" });
  }
});

export default router;