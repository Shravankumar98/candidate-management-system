import mongoose from "mongoose";
import { logger } from "../lib/logger";

export async function connectDB(): Promise<void> {
  const mongoUri = process.env.MONGO_URI || process.env.DATABASE_URL;

  if (!mongoUri) {
    throw new Error(
      "MONGO_URI (or DATABASE_URL) environment variable is required.",
    );
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(mongoUri);

    logger.info("MongoDB connected successfully.");
  } catch (error) {
    logger.error({ error }, "Failed to connect to MongoDB.");
    process.exit(1);
  }
}