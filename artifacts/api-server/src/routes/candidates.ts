import { Router, type IRouter } from "express";
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

import Candidate from "../models/Candidate";
import Note from "../models/Note";
import Activity from "../models/Activity";

const router: IRouter = Router();

/* -------------------------------------------------------------------------- */
/*                                SERIALIZERS                                 */
/* -------------------------------------------------------------------------- */

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

function serializeNote(note: any) {
  return {
    id: note._id.toString(),
    candidateId: note.candidateId.toString(),
    content: note.content,
    authorName: note.authorName,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

function serializeActivity(activity: any) {
  return {
    id: activity._id.toString(),
    candidateId: activity.candidateId.toString(),
    candidateName: activity.candidateName,
    action: activity.action,
    oldValue: activity.oldValue,
    newValue: activity.newValue,
    createdAt: activity.createdAt.toISOString(),
  };
}

/* -------------------------------------------------------------------------- */
/*                              GET CANDIDATES                                */
/* -------------------------------------------------------------------------- */

router.get("/candidates", requireAuth, async (req, res): Promise<void> => {
  const parsed = ListCandidatesQueryParams.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({
      error: parsed.error.message,
    });
    return;
  }

  const {
    page = 1,
    limit = 20,
    search,
    status,
    sortBy,
    sortOrder,
  } = parsed.data;

  const query: any = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { currentCompany: { $regex: search, $options: "i" } },
      { position: { $regex: search, $options: "i" } },
    ];
  }

  if (status) {
    query.status = status;
  }

  let sortField = "createdAt";

  switch (sortBy) {
    case "name":
      sortField = "name";
      break;

    case "updatedAt":
      sortField = "updatedAt";
      break;

    case "yearsOfExperience":
      sortField = "yearsOfExperience";
      break;
  }

  const sort: any = {
    [sortField]: sortOrder === "asc" ? 1 : -1,
  };

  const [rows, total] = await Promise.all([
    Candidate.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),

    Candidate.countDocuments(query),
  ]);

  res.json({
    data: rows.map(serializeCandidate),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

router.post("/candidates", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateCandidateBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: parsed.error.message,
    });
    return;
  }

  const { skills, status, ...rest } = parsed.data;

  const candidate = await Candidate.create({
    ...rest,
    skills: skills ?? [],
    status: status ?? "applied",
  });

  await Activity.create({
    candidateId: candidate._id,
    candidateName: candidate.name,
    action: "Candidate added",
    newValue: candidate.status,
  });

  res.status(201).json(serializeCandidate(candidate));
});

router.get("/candidates/:id", requireAuth, async (req, res): Promise<void> => {
  const params = GetCandidateParams.safeParse(req.params);

  if (!params.success) {
    res.status(400).json({
      error: params.error.message,
    });
    return;
  }

  const candidate = await Candidate.findById(params.data.id);

  if (!candidate) {
    res.status(404).json({
      error: "Candidate not found",
    });
    return;
  }

  const [notes, activityLogs] = await Promise.all([
    Note.find({
      candidateId: candidate._id as any,
    }).sort({
      createdAt: -1,
    }),

    Activity.find({
      candidateId: candidate._id,
    }).sort({
      createdAt: -1,
    }),
  ]);

  res.json({
    ...serializeCandidate(candidate),
    notes: notes.map(serializeNote),
    activityLogs: activityLogs.map(serializeActivity),
  });
});

router.patch(
  "/candidates/:id",
  requireAuth,
  async (req, res): Promise<void> => {
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

    const existing = await Candidate.findById(params.data.id);

    if (!existing) {
      res.status(404).json({ error: "Candidate not found" });
      return;
    }

    const candidate = await Candidate.findByIdAndUpdate(
      params.data.id,
      parsed.data,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!candidate) {
      res.status(404).json({ error: "Candidate not found" });
      return;
    }

    if (parsed.data.status && parsed.data.status !== existing.status) {
      await Activity.create({
        candidateId: candidate._id,
        candidateName: candidate.name,
        action: "Status changed",
        oldValue: existing.status,
        newValue: parsed.data.status,
      });
    } else if (parsed.data.name || parsed.data.email) {
      await Activity.create({
        candidateId: candidate._id,
        candidateName: candidate.name,
        action: "Profile updated",
      });
    }

    res.json(serializeCandidate(candidate));
  },
);

router.delete(
  "/candidates/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = DeleteCandidateParams.safeParse(req.params);

    if (!params.success) {
      res.status(400).json({
        error: params.error.message,
      });
      return;
    }

    const candidate = await Candidate.findByIdAndDelete(params.data.id);

    if (!candidate) {
      res.status(404).json({
        error: "Candidate not found",
      });
      return;
    }

    await Promise.all([
      Note.deleteMany({
        candidateId: candidate._id as any,
      }),

      Activity.deleteMany({
        candidateId: candidate._id,
      }),
    ]);

    res.sendStatus(204);
  },
);

router.patch(
  "/candidates/:id/status",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = UpdateCandidateStatusParams.safeParse(req.params);

    if (!params.success) {
      res.status(400).json({
        error: params.error.message,
      });
      return;
    }

    const parsed = UpdateCandidateStatusBody.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.message,
      });
      return;
    }

    const existing = await Candidate.findById(params.data.id);

    if (!existing) {
      res.status(404).json({
        error: "Candidate not found",
      });
      return;
    }

    existing.status = parsed.data.status;

    await existing.save();

    await Activity.create({
      candidateId: existing._id,
      candidateName: existing.name,
      action: "Status changed",
      oldValue: existing.status,
      newValue: parsed.data.status,
    });

    res.json(serializeCandidate(existing));
  },
);

router.get(
  "/candidates/:candidateId/notes",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = ListCandidateNotesParams.safeParse(req.params);

    if (!params.success) {
      res.status(400).json({
        error: params.error.message,
      });
      return;
    }

    const notes = await Note.find({
      candidateId: params.data.candidateId,
    }).sort({
      createdAt: -1,
    });

    res.json(notes.map(serializeNote));
  },
);

router.post(
  "/candidates/:candidateId/notes",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = CreateCandidateNoteParams.safeParse(req.params);

    if (!params.success) {
      res.status(400).json({
        error: params.error.message,
      });
      return;
    }

    const parsed = CreateCandidateNoteBody.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.message,
      });
      return;
    }

    const candidate = await Candidate.findById(params.data.candidateId);

    if (!candidate) {
      res.status(404).json({
        error: "Candidate not found",
      });
      return;
    }

    const note = await Note.create({
      candidateId: candidate._id as any,
      content: parsed.data.content,
      authorName: parsed.data.authorName,
    });

    await Activity.create({
      candidateId: candidate._id,
      candidateName: candidate.name,
      action: `Note added by ${parsed.data.authorName}`,
    });

    res.status(201).json(serializeNote(note));
  },
);

export default router;
