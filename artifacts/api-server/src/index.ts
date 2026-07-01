import dotenv from "dotenv";
import path from "path";
import app from "./app";
import { logger } from "./lib/logger";
import { connectDB } from "./config/mongodb";

dotenv.config({
  path: path.resolve(import.meta.dirname, "../../../.env"),
});

const rawPort = process.env.PORT;
const port = Number(rawPort ?? 4000);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function bootstrap() {
  // Connect MongoDB
  await connectDB();

  app.listen(port, () => {
    logger.info(
      {
        port,
        mongodb: process.env.MONGODB_URI,
      },
      "Server listening",
    );
  });
}

bootstrap().catch((error) => {
  logger.error({ error }, "Failed to start server");
  process.exit(1);
});