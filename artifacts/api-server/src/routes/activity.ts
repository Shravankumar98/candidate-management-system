import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { ListActivityQueryParams } from "@workspace/api-zod";

import Activity from "../models/Activity";

const router: IRouter = Router();

router.get("/activity", requireAuth, async (req, res): Promise<void> => {
  const parsed = ListActivityQueryParams.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({
      error: parsed.error.message,
    });
    return;
  }

  try {
    const { limit, candidateId } = parsed.data;

    const query = candidateId ? { candidateId } : {};

    const logs = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(limit ?? 20);

    res.json(
      logs.map((activity) => ({
        id: activity._id.toString(),

        candidateId: activity.candidateId.toString(),

        candidateName: activity.candidateName,

        action: activity.action,

        oldValue: activity.oldValue,

        newValue: activity.newValue,

        createdAt: activity.createdAt.toISOString(),
      })),
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to load activity",
    });
  }
});

export default router;
