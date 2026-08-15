import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { InvalidYoutubeUrlError } from "../utils/videoId";
import { TranscriptUnavailableError } from "../services/youtube.service";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Not Found" });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Invalid request", details: err.flatten() });
    return;
  }

  if (err instanceof InvalidYoutubeUrlError) {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err instanceof TranscriptUnavailableError) {
    res.status(422).json({ error: err.message });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
}
