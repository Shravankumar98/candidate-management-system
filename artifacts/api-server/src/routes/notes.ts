import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import {
  UpdateNoteParams,
  UpdateNoteBody,
  DeleteNoteParams,
} from "@workspace/api-zod";

import Note from "../models/Note";

const router: IRouter = Router();

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

router.patch("/notes/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateNoteParams.safeParse(req.params);

  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateNoteBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const note = await Note.findByIdAndUpdate(
      params.data.id,
      {
        content: parsed.data.content,
      },
      {
        new: true,
      },
    );

    if (!note) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    res.json(serializeNote(note));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update note" });
  }
});

router.delete("/notes/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteNoteParams.safeParse(req.params);

  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  try {
    const note = await Note.findByIdAndDelete(params.data.id);

    if (!note) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

export default router;