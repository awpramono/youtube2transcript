import cors from "cors";
import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { transcriptRouter } from "./routes/transcript.route";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "100kb" }));
  app.use(morgan("tiny"));

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api", transcriptRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
