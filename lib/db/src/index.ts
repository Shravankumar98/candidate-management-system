import mongoose from "mongoose";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI must be set.");
}

mongoose.set("strictQuery", true);

await mongoose.connect(process.env.MONGO_URI);

export { mongoose };
