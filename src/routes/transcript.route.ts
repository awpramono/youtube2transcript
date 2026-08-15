import { Router } from "express";
import { getTranscript, postTranscript } from "../controllers/transcript.controller";

export const transcriptRouter = Router();

// POST /api/transcript { "url": "https://www.youtube.com/watch?v=..." }
transcriptRouter.post("/transcript", postTranscript);

// GET /api/transcript?url=https://www.youtube.com/watch?v=...
transcriptRouter.get("/transcript", getTranscript);
