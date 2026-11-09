export function isValidYouTubeUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  // Match youtube.com/watch, youtube.com/playlist, youtu.be, etc.
  const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i;
  return ytRegex.test(trimmed);
}

export function truncateText(text: string, maxLength: number = 60): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + "...";
}
