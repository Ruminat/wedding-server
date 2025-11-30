import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { addWeddingAnswer, clearWeddingAnswers, getWeddingAnswers, TWeddingAnswer } from "./db";
import { createDataDirIfMissing } from "./lib/FS/utils";
import { checkNodeFeatures } from "./lib/NodeJS/utils";

checkNodeFeatures();

config();

createDataDirIfMissing();

const app = express();
const HOST = process.env.HOST || "http://localhost";
const SECRET_KEY = process.env.SECRET_KEY;
const PORT = process.env.PORT || 3176;

app.use(cors());
app.use(express.json());

app.post("/api/wedding/answer", (req, res) => {
  try {
    const { who, answer }: TWeddingAnswer = req.body;

    if (!who || !answer) {
      return res.status(400).json({ error: "Missing required fields: who, answer" });
    }

    const newAnswer: TWeddingAnswer = { who, answer, at: Date.now() };

    addWeddingAnswer(newAnswer);

    console.log("New answer saved:", newAnswer);

    return res.status(200).json({
      success: true,
      message: "Answer saved successfully",
    });
  } catch (error) {
    console.error("Error saving answer:", error);

    return res.status(500).json({ error: "Couldn't save answer" });
  }
});

app.get("/api/ping", (req, res) => {
  try {
    return res.json({ answer: "pong" });
  } catch (error) {
    return res.status(500).json({ error: "Couldn't answer pong" });
  }
});

app.get("/api/wedding/answers", (req, res) => {
  try {
    if (!isSecretValid(req)) {
      return secretValidationError(res);
    }

    return res.json(getWeddingAnswers());
  } catch (error) {
    console.error("Error reading answers:", error);

    return res.status(500).json({ error: "Couldn't get answers" });
  }
});

app.post(`/api/wedding/clear`, (req, res) => {
  try {
    if (!isSecretValid(req)) {
      return secretValidationError(res);
    }

    clearWeddingAnswers();

    console.log("All answers cleared");

    return res.json({
      success: true,
      message: "All answers cleared",
    });
  } catch (error) {
    console.error("Error reading answers:", error);

    return res.status(500).json({ error: "Couldn't get answers" });
  }
});

app.listen(PORT, () => {
  console.log(`Wedding server running on port ${PORT}\n`);

  console.log(`API endpoints${SECRET_KEY ? " (with secret!)" : ""}:`);
  console.log(`- POST ${HOST}:${PORT}/api/wedding/answer`);
  console.log(`- POST ${HOST}:${PORT}/api/wedding/clear`);
  console.log(`- GET  ${HOST}:${PORT}/api/wedding/answers`);
});

function isSecretValid(req: express.Request) {
  return !SECRET_KEY || req.query?.secret_key === SECRET_KEY;
}

function secretValidationError(res: express.Response) {
  return res.status(403).json({ error: "Forbidden" });
}
