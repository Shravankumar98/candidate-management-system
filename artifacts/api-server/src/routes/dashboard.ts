import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/requireAuth";

import Candidate from "../models/Candidate";
import Activity from "../models/Activity";

const router: IRouter = Router();

router.get("/dashboard", requireAuth, async (_req, res): Promise<void> => {
  try {
    const [allCandidates, recentCandidates, recentActivity] = await Promise.all(
      [
        Candidate.find().select("status"),

        Candidate.find().sort({ createdAt: -1 }).limit(5),

        Activity.find().sort({ createdAt: -1 }).limit(10),
      ],
    );

    const byStatus = {
      applied: 0,
      screening: 0,
      interview: 0,
      offer: 0,
      selected: 0,
      rejected: 0,
    };

    for (const candidate of allCandidates) {
      if (candidate.status in byStatus) {
        byStatus[candidate.status as keyof typeof byStatus]++;
      }
    }

    res.json({
      totalCandidates: allCandidates.length,

      byStatus,

      recentCandidates: recentCandidates.map((candidate) => ({
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
      })),

      recentActivity: recentActivity.map((activity) => ({
        id: activity._id.toString(),

        candidateId: activity.candidateId.toString(),

        candidateName: activity.candidateName,

        action: activity.action,

        oldValue: activity.oldValue,

        newValue: activity.newValue,

        createdAt: activity.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to load dashboard",
    });
  }
});

export default router;
