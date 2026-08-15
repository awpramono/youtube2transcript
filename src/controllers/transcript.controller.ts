import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { getTranscriptForUrl } from "../services/youtube.service";

const transcriptRequestSchema = z.object({
  url: z.string().min(1, "url is required"),
  lang: z.string().min(2).max(10).optional(),
});

export async function postTranscript(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { url, lang } = transcriptRequestSchema.parse(req.body);
    const result = await getTranscriptForUrl(url, lang);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

const transcriptQuerySchema = z.object({
  url: z.string().min(1, "url query param is required"),
  lang: z.string().min(2).max(10).optional(),
});

export async function getTranscript(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { url, lang } = transcriptQuerySchema.parse(req.query);
    const result = await getTranscriptForUrl(url, lang);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
