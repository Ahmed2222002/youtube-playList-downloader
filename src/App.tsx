import { useEffect } from "react";
import { useStore } from "./store";
import "./App.css";

import Header from "./components/Header";
import UrlInputSection from "./components/UrlInputSection";
import DownloadOptionsBar from "./components/DownloadOptionsBar";
import PlaylistSummaryCard from "./components/PlaylistSummaryCard";
import VideoList from "./components/VideoList";
import EmptyState from "./components/EmptyState";

export default function App() {
  const {
    playlistInfo,
    initDestinationFolder,
    updateVideoProgress,
  } = useStore();

  useEffect(() => {
    // Initialize default download directory from Electron
    initDestinationFolder();

    // Listen to download progress events from Electron main process
    if (typeof window !== "undefined" && window.electron?.onDownloadProgress) {
      const unsubscribe = window.electron.onDownloadProgress((data) => {
        updateVideoProgress(
          data.url,
          data.percentage,
          data.speed_str,
          data.eta_str,
          data.status,
          data.error,
        );
      });

      return () => {
        unsubscribe();
      };
    }
  }, [initDestinationFolder, updateVideoProgress]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-red-500/20 selection:text-red-600">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Header />
        <UrlInputSection />
        <DownloadOptionsBar />

        {playlistInfo ? (
          <>
            <PlaylistSummaryCard />
            <VideoList />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
