import mongoose, { Schema, type Document } from "mongoose";

export type CandidateStatus = "applied" | "screening" | "interview" | "offer" | "selected" | "rejected";

export interface ICandidate extends Document {
  name: string;
  email: string;
  phone?: string;
  skills?: string[];
  yearsOfExperience?: number;
  currentCompany?: string;
  resumeUrl?: string;
  position?: string;
  status: CandidateStatus;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema = new Schema<ICandidate>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    yearsOfExperience: Number,
    currentCompany: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    position: { type: String, trim: true },
    status: {
      type: String,
      enum: ["applied", "screening", "interview", "offer", "selected", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true },
);

export const Candidate = mongoose.model<ICandidate>("Candidate", CandidateSchema);
