import { fetchTranscript } from "youtube-transcript-plus";
import { extractVideoId } from "../utils/videoId";

export interface TranscriptSegment {
  text: string;
  offset: number;
  duration: number;
  lang?: string;
}

export interface TranscriptResult {
  videoId: string;
  language: string | null;
  segments: TranscriptSegment[];
  fullText: string;
}

export class TranscriptUnavailableError extends Error {
  constructor(videoId: string, cause?: unknown) {
    super(`Transcript is unavailable for video: ${videoId}`);
    this.name = "TranscriptUnavailableError";
    if (cause instanceof Error) this.cause = cause;
  }
}

export async function getTranscriptForUrl(
  rawUrl: string,
  lang?: string
): Promise<TranscriptResult> {
  const videoId = extractVideoId(rawUrl);

  try {
    const raw = await fetchTranscript(videoId, lang ? { lang } : undefined);

    const segments: TranscriptSegment[] = raw.map((item) => ({
      text: item.text,
      offset: item.offset,
      duration: item.duration,
      lang: item.lang,
    }));

    return {
      videoId,
      language: segments[0]?.lang ?? lang ?? null,
      segments,
      fullText: segments.map((s) => s.text).join(" ").replace(/\s+/g, " ").trim(),
    };
  } catch (err) {
    throw new TranscriptUnavailableError(videoId, err);
  }
}
