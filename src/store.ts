import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  PlaylistInfo,
  VideoItem,
  DownloadFilter,
  VideoQuality,
  AudioFormat,
  VideoFormat,
  VideoDownloadStatus,
} from "./types";

interface DownloaderStore {
  url: string;
  isFetching: boolean;
  fetchError: string | null;
  playlistInfo: PlaylistInfo | null;
  selectedUrls: string[];
  destinationFolder: string;
  filter: DownloadFilter;
  quality: VideoQuality;
  audioFormat: AudioFormat;
  videoFormat: VideoFormat;
  isDownloading: boolean;

  // Actions
  setUrl: (url: string) => void;
  setFilter: (filter: DownloadFilter) => void;
  setQuality: (quality: VideoQuality) => void;
  setAudioFormat: (format: AudioFormat) => void;
  setVideoFormat: (format: VideoFormat) => void;
  setDestinationFolder: (folder: string) => void;
  initDestinationFolder: () => Promise<void>;
  browseDestinationFolder: () => Promise<void>;
  openDestinationFolder: () => Promise<void>;

  fetchInfo: (urlToFetch?: string) => Promise<void>;
  clearPlaylist: () => void;

  toggleSelectAll: () => void;
  toggleSelectVideo: (url: string) => void;
  selectAll: () => void;
  deselectAll: () => void;

  updateVideoProgress: (
    url: string,
    progress: number,
    speed?: string,
    eta?: string,
    status?: VideoDownloadStatus,
    error?: string,
  ) => void;

  downloadSingle: (videoUrl: string) => Promise<void>;
  downloadSelected: () => Promise<void>;
}

export const useStore = create<DownloaderStore>()(
  persist(
    (set, get) => ({
      url: "",
      isFetching: false,
      fetchError: null,
      playlistInfo: null,
      selectedUrls: [],
      destinationFolder: "",
      filter: "mergevideo",
      quality: "highest",
      audioFormat: "mp3",
      videoFormat: "mp4",
      isDownloading: false,

      setUrl: (url: string) => set({ url, fetchError: null }),

      setFilter: (filter: DownloadFilter) => set({ filter }),

      setQuality: (quality: VideoQuality) => set({ quality }),

      setAudioFormat: (audioFormat: AudioFormat) => set({ audioFormat }),

      setVideoFormat: (videoFormat: VideoFormat) => set({ videoFormat }),

      setDestinationFolder: (destinationFolder: string) => set({ destinationFolder }),

      initDestinationFolder: async () => {
        if (!get().destinationFolder && typeof window !== "undefined" && window.electron?.getDefaultDownloadPath) {
          try {
            const defaultPath = await window.electron.getDefaultDownloadPath();
            if (defaultPath) {
              set({ destinationFolder: defaultPath });
            }
          } catch (e) {
            console.error("Failed to get default download path:", e);
          }
        }
      },

      browseDestinationFolder: async () => {
        if (typeof window !== "undefined" && window.electron?.selectFolder) {
          try {
            const selected = await window.electron.selectFolder();
            if (selected) {
              set({ destinationFolder: selected });
            }
          } catch (e) {
            console.error("Failed to select folder:", e);
          }
        }
      },

      openDestinationFolder: async () => {
        if (typeof window !== "undefined" && window.electron?.openFolder) {
          try {
            const folder = get().destinationFolder;
            await window.electron.openFolder(folder);
          } catch (e) {
            console.error("Failed to open destination folder:", e);
          }
        }
      },

      fetchInfo: async (urlToFetch?: string) => {
        const targetUrl = (urlToFetch || get().url).trim();
        if (!targetUrl) return;

        set({ isFetching: true, fetchError: null });

        try {
          if (!window.electron?.fetchVideoInfo) {
            throw new Error("Electron API is not available");
          }

          const rawInfo = await window.electron.fetchVideoInfo(targetUrl);

          const formattedVideos: VideoItem[] = rawInfo.videos.map((v) => ({
            ...v,
            status: "idle" as VideoDownloadStatus,
            progress: 0,
          }));

          const playlist: PlaylistInfo = {
            ...rawInfo,
            videos: formattedVideos,
          };

          const allUrls = formattedVideos.map((v) => v.url);

          set({
            playlistInfo: playlist,
            selectedUrls: allUrls,
            isFetching: false,
            fetchError: null,
          });
        } catch (error: unknown) {
          console.error("Error fetching video info:", error);
          const message = error instanceof Error ? error.message : "Failed to fetch playlist or video information. Please verify the URL.";
          set({
            isFetching: false,
            fetchError: message,
          });
        }
      },

      clearPlaylist: () => {
        set({
          playlistInfo: null,
          selectedUrls: [],
          fetchError: null,
          url: "",
        });
      },

      toggleSelectAll: () => {
        const { playlistInfo, selectedUrls } = get();
        if (!playlistInfo) return;

        if (selectedUrls.length === playlistInfo.videos.length) {
          set({ selectedUrls: [] });
        } else {
          set({ selectedUrls: playlistInfo.videos.map((v) => v.url) });
        }
      },

      selectAll: () => {
        const { playlistInfo } = get();
        if (!playlistInfo) return;
        set({ selectedUrls: playlistInfo.videos.map((v) => v.url) });
      },

      deselectAll: () => {
        set({ selectedUrls: [] });
      },

      toggleSelectVideo: (videoUrl: string) => {
        const { selectedUrls } = get();
        if (selectedUrls.includes(videoUrl)) {
          set({ selectedUrls: selectedUrls.filter((u) => u !== videoUrl) });
        } else {
          set({ selectedUrls: [...selectedUrls, videoUrl] });
        }
      },

      updateVideoProgress: (url, progress, speed, eta, status, error) => {
        const { playlistInfo } = get();
        if (!playlistInfo) return;

        const updatedVideos = playlistInfo.videos.map((video) => {
          if (video.url === url) {
            return {
              ...video,
              progress: typeof progress === "number" ? Math.min(100, Math.max(0, progress)) : video.progress,
              speed: speed !== undefined ? speed : video.speed,
              eta: eta !== undefined ? eta : video.eta,
              status: status || video.status,
              error: error !== undefined ? error : video.error,
            };
          }
          return video;
        });

        set({
          playlistInfo: {
            ...playlistInfo,
            videos: updatedVideos,
          },
        });
      },

      downloadSingle: async (videoUrl: string) => {
        const { filter, quality, audioFormat, videoFormat, destinationFolder, updateVideoProgress } = get();

        updateVideoProgress(videoUrl, 0, "Starting...", undefined, "downloading");

        try {
          const type = filter === "audioonly" ? audioFormat : videoFormat;
          const chosenQuality = filter === "audioonly" ? "highest" : quality;

          const res = await window.electron.downloadVideo({
            url: videoUrl,
            filter,
            quality: chosenQuality,
            outputPath: destinationFolder,
            type,
          });

          if (!res.success) {
            updateVideoProgress(videoUrl, 0, undefined, undefined, "error", res.error);
          } else {
            updateVideoProgress(videoUrl, 100, "Done", "0s", "completed");
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Failed to download";
          updateVideoProgress(videoUrl, 0, undefined, undefined, "error", message);
        }
      },

      downloadSelected: async () => {
        const {
          selectedUrls,
          playlistInfo,
          filter,
          quality,
          audioFormat,
          videoFormat,
          destinationFolder,
          updateVideoProgress,
          isDownloading,
        } = get();

        if (isDownloading || !playlistInfo || selectedUrls.length === 0) return;

        set({ isDownloading: true });

        // Mark all selected as queued
        selectedUrls.forEach((url) => {
          updateVideoProgress(url, 0, "Queued", undefined, "queued");
        });

        const type = filter === "audioonly" ? audioFormat : videoFormat;
        const chosenQuality = filter === "audioonly" ? "highest" : quality;

        for (const url of selectedUrls) {
          updateVideoProgress(url, 0, "Connecting...", undefined, "downloading");

          try {
            const res = await window.electron.downloadVideo({
              url,
              filter,
              quality: chosenQuality,
              outputPath: destinationFolder,
              type,
            });

            if (!res.success) {
              updateVideoProgress(url, 0, undefined, undefined, "error", res.error);
            } else {
              updateVideoProgress(url, 100, "Done", "0s", "completed");
            }
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed";
            updateVideoProgress(url, 0, undefined, undefined, "error", message);
          }
        }

        set({ isDownloading: false });
      },
    }),
    {
      name: "youtube-downloader-storage",
      partialize: (state) => ({
        destinationFolder: state.destinationFolder,
        filter: state.filter,
        quality: state.quality,
        audioFormat: state.audioFormat,
        videoFormat: state.videoFormat,
      }),
    },
  ),
);
