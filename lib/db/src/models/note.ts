import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    authorName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Note = mongoose.model(
  "Note",
  NoteSchema
);

export type NoteDocument =
  mongoose.InferSchemaType<typeof NoteSchema>;