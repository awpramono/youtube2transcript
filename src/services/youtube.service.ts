import { fetchTranscript } from "youtube-transcript-plus";
import { extractVideoId } from "../utils/videoId";

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  "#39": "'",
  nbsp: " ",
};

function decodeHtmlEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === "#") {
      const codePoint =
        entity[1] === "x" || entity[1] === "X"
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }
    const lower = entity.toLowerCase();
    return lower in NAMED_ENTITIES ? NAMED_ENTITIES[lower] : match;
  });
}

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
      text: decodeHtmlEntities(item.text),
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
