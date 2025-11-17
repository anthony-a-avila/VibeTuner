import dotenv from "dotenv";
dotenv.config();
console.log("OPENAI_API_KEY present?", !!process.env.OPENAI_API_KEY);


import express from "express";
import cors from "cors";
import searchRouter from "./routes/search";
import collectionRouter from "./routes/collection";
import { initDb } from "./db/database";

const app = express();

initDb();

app.use(cors());
app.use(express.json());

// all backend API routes
app.use("/api", searchRouter);
app.use("/api", collectionRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
