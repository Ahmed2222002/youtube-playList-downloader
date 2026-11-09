import { YtDlp, type QualityOptions, type VideoProgress } from "ytdlp-nodejs";
import path from "path";
import fs from "fs";
import { app } from "electron";
import { fileURLToPath } from "url";

export type VideoQuality = QualityOptions["mergevideo"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getBinaryPaths() {
  const isPackaged = app.isPackaged;
  const possibleBinDirs: string[] = [];

  if (isPackaged && process.resourcesPath) {
    possibleBinDirs.push(path.join(process.resourcesPath, "bin"));
  }
  possibleBinDirs.push(path.join(process.cwd(), "bin"));
  possibleBinDirs.push(path.join(app.getAppPath(), "bin"));
  possibleBinDirs.push(path.join(__dirname, "..", "..", "bin"));
  possibleBinDirs.push(path.join(__dirname, "..", "bin"));
  possibleBinDirs.push(path.join(process.cwd(), "node_modules", "ytdlp-nodejs", "bin"));
  possibleBinDirs.push(path.join(app.getAppPath(), "node_modules", "ytdlp-nodejs", "bin"));

  let binaryPath: string | undefined;
  let ffmpegPath: string | undefined;

  for (const dir of possibleBinDirs) {
    const ytdlpCandidate = path.join(dir, process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp");
    if (!binaryPath && fs.existsSync(ytdlpCandidate)) {
      binaryPath = ytdlpCandidate;
    }
    const ffmpegCandidate = path.join(dir, process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg");
    if (!ffmpegPath && fs.existsSync(ffmpegCandidate)) {
      ffmpegPath = ffmpegCandidate;
    }
  }

  return { binaryPath, ffmpegPath };
}

const { binaryPath, ffmpegPath } = getBinaryPaths();
const ytdlp = new YtDlp({
  binaryPath,
  ffmpegPath,
});

export interface FormattedVideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  durationSeconds?: number;
  size?: string;
  url: string;
}

export interface FormattedPlaylistInfo {
  type: "playlist" | "video";
  title: string;
  thumbnail?: string;
  uploader?: string;
  videoCount: number;
  videos: FormattedVideoItem[];
}

export interface DownloadVideoOptions {
  url: string;
  filter: keyof QualityOptions;
  quality: VideoQuality;
  outputPath: string;
  type?: "mp4" | "webm" | "aac" | "flac" | "mp3" | "m4a" | "opus" | "vorbis" | "wav" | "alac" | "mkv" | "ogg" | "flv";
  fileName?: string;
}

function formatDuration(seconds?: number): string {
  if (!seconds || isNaN(seconds) || seconds <= 0) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatSize(bytes?: number): string | undefined {
  if (!bytes || isNaN(bytes) || bytes <= 0) return undefined;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

interface RawVideoEntry {
  id?: string;
  title?: string;
  thumbnail?: string;
  thumbnails?: { url?: string }[];
  duration?: number;
  duration_string?: string;
  filesize?: number;
  filesize_approx?: number;
  url?: string;
  webpage_url?: string;
  original_url?: string;
}

interface RawMediaInfo extends RawVideoEntry {
  _type?: string;
  fulltitle?: string;
  uploader?: string;
  channel?: string;
  entries?: RawVideoEntry[];
}

export async function fetchVideoOrPlaylistInfo(url: string): Promise<FormattedPlaylistInfo> {
  const info = (await ytdlp.getInfoAsync(url)) as unknown as RawMediaInfo;

  if (!info) {
    throw new Error("Unable to retrieve information for the provided URL.");
  }

  const isPlaylist = info._type === "playlist" || Array.isArray(info.entries);

  if (isPlaylist && Array.isArray(info.entries)) {
    const validEntries = info.entries.filter((entry): entry is RawVideoEntry => entry != null);
    const videos: FormattedVideoItem[] = validEntries.map((entry, index) => {
      const durationSeconds = typeof entry.duration === "number" ? entry.duration : undefined;
      const durationStr = entry.duration_string || formatDuration(durationSeconds);

      let thumbnail = "";
      if (typeof entry.thumbnail === "string") {
        thumbnail = entry.thumbnail;
      } else if (Array.isArray(entry.thumbnails) && entry.thumbnails.length > 0) {
        thumbnail = entry.thumbnails[entry.thumbnails.length - 1].url || "";
      }

      const videoUrl =
        entry.url ||
        entry.webpage_url ||
        entry.original_url ||
        (entry.id ? `https://www.youtube.com/watch?v=${entry.id}` : url);

      return {
        id: entry.id || String(index + 1),
        title: entry.title || `Video ${index + 1}`,
        thumbnail,
        duration: durationStr,
        durationSeconds,
        size: formatSize(entry.filesize_approx || entry.filesize),
        url: videoUrl,
      };
    });

    let playlistThumbnail = "";
    if (typeof info.thumbnail === "string") {
      playlistThumbnail = info.thumbnail;
    } else if (videos.length > 0 && videos[0].thumbnail) {
      playlistThumbnail = videos[0].thumbnail;
    }

    return {
      type: "playlist",
      title: info.title || "YouTube Playlist",
      thumbnail: playlistThumbnail,
      uploader: info.uploader || info.channel || "",
      videoCount: videos.length,
      videos,
    };
  }

  // Single video
  const durationSeconds = typeof info.duration === "number" ? info.duration : undefined;
  const durationStr = info.duration_string || formatDuration(durationSeconds);

  let thumbnail = "";
  if (typeof info.thumbnail === "string") {
    thumbnail = info.thumbnail;
  } else if (Array.isArray(info.thumbnails) && info.thumbnails.length > 0) {
    thumbnail = info.thumbnails[info.thumbnails.length - 1].url || "";
  }

  const singleVideo: FormattedVideoItem = {
    id: info.id || "1",
    title: info.title || info.fulltitle || "YouTube Video",
    thumbnail,
    duration: durationStr,
    durationSeconds,
    size: formatSize(info.filesize_approx || info.filesize),
    url: info.original_url || info.webpage_url || url,
  };

  return {
    type: "video",
    title: singleVideo.title,
    thumbnail: singleVideo.thumbnail,
    uploader: info.uploader || info.channel || "",
    videoCount: 1,
    videos: [singleVideo],
  };
}

export async function downloadSingleVideo(
  options: DownloadVideoOptions,
  onProgress?: (progress: VideoProgress) => void
) {
  const { url, filter, quality, outputPath, type, fileName } = options;

  if (outputPath && !fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  return await ytdlp.downloadAsync(url, {
    format: {
      filter,
      quality,
      type,
    },
    onProgress: (progress) => {
      if (onProgress) {
        onProgress(progress);
      }
    },
    paths: outputPath || undefined,
    abortOnError: true,
    output: fileName || undefined,
  });
}
