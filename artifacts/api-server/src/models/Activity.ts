import mongoose, { Schema, type Document } from "mongoose";

export interface IActivity extends Document {
  candidateId: mongoose.Types.ObjectId;
  candidateName: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      index: true,
    },

    candidateName: {
      type: String,
      required: true,
      trim: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
    },

    oldValue: {
      type: String,
      trim: true,
    },

    newValue: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

export default mongoose.model<IActivity>("Activity", ActivitySchema);