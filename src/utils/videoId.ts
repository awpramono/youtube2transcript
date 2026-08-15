const YOUTUBE_HOSTS = new Set(["www.youtube.com", "youtube.com", "m.youtube.com", "youtu.be"]);

export class InvalidYoutubeUrlError extends Error {
  constructor(input: string) {
    super(`Not a valid YouTube video URL: ${input}`);
    this.name = "InvalidYoutubeUrlError";
  }
}

export function extractVideoId(rawUrl: string): string {
  const input = rawUrl.trim();

  // Allow passing a bare 11-char video id directly.
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new InvalidYoutubeUrlError(input);
  }

  if (!YOUTUBE_HOSTS.has(url.hostname)) {
    throw new InvalidYoutubeUrlError(input);
  }

  if (url.hostname === "youtu.be") {
    const id = url.pathname.replace(/^\//, "").split("/")[0];
    if (id) return id;
    throw new InvalidYoutubeUrlError(input);
  }

  if (url.pathname === "/watch") {
    const id = url.searchParams.get("v");
    if (id) return id;
    throw new InvalidYoutubeUrlError(input);
  }

  const pathMatch = url.pathname.match(/^\/(embed|shorts|live)\/([a-zA-Z0-9_-]{11})/);
  if (pathMatch) {
    return pathMatch[2];
  }

  throw new InvalidYoutubeUrlError(input);
}
