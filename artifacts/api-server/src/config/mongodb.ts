import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set for MongoDB connection.");
  }

  await mongoose.connect(process.env.DATABASE_URL);
}
