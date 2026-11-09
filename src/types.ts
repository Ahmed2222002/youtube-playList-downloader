export type VideoDownloadStatus =
  | "idle"
  | "queued"
  | "downloading"
  | "completed"
  | "error";

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  durationSeconds?: number;
  size?: string;
  url: string;
  status: VideoDownloadStatus;
  progress: number;
  speed?: string;
  eta?: string;
  error?: string;
}

export interface PlaylistInfo {
  type: "playlist" | "video";
  title: string;
  thumbnail?: string;
  uploader?: string;
  videoCount: number;
  videos: VideoItem[];
}

export type DownloadFilter = "mergevideo" | "audioonly";

export type VideoQuality =
  | "highest"
  | "2160p"
  | "1440p"
  | "1080p"
  | "720p"
  | "480p"
  | "360p"
  | "240p"
  | "144p"
  | "lowest";

export type AudioFormat = "mp3" | "m4a" | "wav" | "aac" | "flac" | "opus";
export type VideoFormat = "mp4" | "mkv" | "webm";
