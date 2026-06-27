import mongoose, { Schema, type Document } from "mongoose";

export interface INote extends Document {
  candidateId: string;
  content: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    candidateId: { type: String, required: true, index: true },
    content: { type: String, required: true, trim: true },
    authorName: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const Note = mongoose.model<INote>("Note", NoteSchema);
