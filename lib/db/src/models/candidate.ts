import mongoose from "mongoose";

export const candidateStatusEnum = [
  "applied",
  "screening",
  "interview",
  "offer",
  "selected",
  "rejected",
] as const;

const CandidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: String,

    skills: {
      type: [String],
      default: [],
    },

    yearsOfExperience: Number,

    currentCompany: String,

    resumeUrl: String,

    position: String,

    status: {
      type: String,
      enum: candidateStatusEnum,
      default: "applied",
    },
  },
  {
    timestamps: true,
  }
);

export const Candidate = mongoose.model(
  "Candidate",
  CandidateSchema
);

export type CandidateDocument =
  mongoose.InferSchemaType<typeof CandidateSchema>;