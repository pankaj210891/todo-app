import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDB } from "./utils/db";
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todo";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

connectToDB().then(() => {
  app.use("/api/auth", authRoutes);
  app.use("/api/todos", todoRoutes);

  if (process.env.VERCEL !== "true") {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
});

export default app;
