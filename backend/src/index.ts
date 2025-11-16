import dotenv from "dotenv";
dotenv.config();
console.log("OPENAI_API_KEY present?", !!process.env.OPENAI_API_KEY);


import express from "express";
import cors from "cors";
import searchRouter from "./routes/search";

const app = express();

app.use(cors());
app.use(express.json());

// all backend API routes
app.use("/api", searchRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
