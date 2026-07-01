import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    candidateName: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    oldValue: String,

    newValue: String,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

export const ActivityLog = mongoose.model(
  "ActivityLog",
  ActivityLogSchema
);

export type ActivityLogDocument =
  mongoose.InferSchemaType<typeof ActivityLogSchema>;