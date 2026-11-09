type DownloadProgressEvent = {
  url: string;
  percentage: number;
  speed_str?: string;
  eta_str?: string;
  status: "downloading" | "completed" | "error";
  error?: string;
};

type FormattedVideoItem = {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  durationSeconds?: number;
  size?: string;
  url: string;
};

type FormattedPlaylistInfo = {
  type: "playlist" | "video";
  title: string;
  thumbnail?: string;
  uploader?: string;
  videoCount: number;
  videos: FormattedVideoItem[];
};

type DownloadVideoOptions = {
  url: string;
  filter: "mergevideo" | "audioonly" | "videoonly";
  quality:
    | "2160p"
    | "1440p"
    | "1080p"
    | "720p"
    | "480p"
    | "360p"
    | "240p"
    | "144p"
    | "highest"
    | "lowest";
  outputPath: string;
  type?: "mp4" | "webm" | "aac" | "flac" | "mp3" | "m4a" | "opus" | "vorbis" | "wav" | "alac" | "mkv" | "ogg" | "flv";
  fileName?: string;
};

type EventArgMapping = {
  fetchVideoInfo: string;
  selectFolder: void;
  getDefaultDownloadPath: void;
  downloadVideo: DownloadVideoOptions;
  openFolder: string;
};

type EventPayloadMapping = {
  fetchVideoInfo: FormattedPlaylistInfo;
  selectFolder: string | null;
  getDefaultDownloadPath: string;
  downloadVideo: { success: boolean; error?: string };
  openFolder: boolean;
  videoDownloadProgress: DownloadProgressEvent;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    fetchVideoInfo: (url: string) => Promise<FormattedPlaylistInfo>;
    selectFolder: () => Promise<string | null>;
    getDefaultDownloadPath: () => Promise<string>;
    downloadVideo: (options: DownloadVideoOptions) => Promise<{ success: boolean; error?: string }>;
    openFolder: (path: string) => Promise<boolean>;
    onDownloadProgress: (
      callback: (data: DownloadProgressEvent) => void,
    ) => UnsubscribeFunction;
  };
}
