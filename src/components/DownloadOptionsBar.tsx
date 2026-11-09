import { useStore } from "@/store";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { VideoQuality } from "@/types";
import {
  Folder,
  FolderOpen,
  Film,
  Music,
  Download,
  CheckSquare,
  Square,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function DownloadOptionsBar() {
  const {
    filter,
    setFilter,
    quality,
    setQuality,
    destinationFolder,
    browseDestinationFolder,
    openDestinationFolder,
    playlistInfo,
    selectedUrls,
    selectAll,
    deselectAll,
    downloadSelected,
    isDownloading,
  } = useStore();

  const { t } = useTranslation();

  const totalVideos = playlistInfo?.videos.length || 0;
  const selectedCount = selectedUrls.length;
  const allSelected = totalVideos > 0 && selectedCount === totalVideos;

  const qualityOptions: { value: VideoQuality; label: string }[] = [
    { value: "highest", label: "Best Available (Auto)" },
    { value: "2160p", label: "4K Ultra HD (2160p)" },
    { value: "1440p", label: "2K Quad HD (1440p)" },
    { value: "1080p", label: "Full HD (1080p)" },
    { value: "720p", label: "HD (720p)" },
    { value: "480p", label: "SD (480p)" },
    { value: "360p", label: "Low (360p)" },
    { value: "lowest", label: "Lowest Size" },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-4 md:p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
        {/* Mode Selector (Video / Audio) */}
        <div className="lg:col-span-4 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("options.format")}
          </label>
          <div className="grid grid-cols-2 p-1 bg-muted/60 rounded-xl border border-border/60 gap-2">
            <button
              type="button"
              onClick={() => setFilter("mergevideo")}
              disabled={isDownloading}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${filter === "mergevideo"
                  ? "bg-background text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Film className="size-4 text-red-500" />
              <span>{t("options.video")}</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter("audioonly")}
              disabled={isDownloading}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${filter === "audioonly"
                  ? "bg-background text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Music className="size-4 text-purple-500" />
              <span>{t("options.audio")}</span>
            </button>
          </div>
        </div>

        {/* Quality Selector */}
        <div className="lg:col-span-3 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="size-3 text-amber-500" />
            {t("options.quality")}
          </label>
          <div className="relative">
            <select
              value={filter === "audioonly" ? "highest" : quality}
              onChange={(e) => setQuality(e.target.value as VideoQuality)}
              disabled={filter === "audioonly" || isDownloading}
              className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {filter === "audioonly" ? (
                <option value="highest">Best Audio (MP3 - 320kbps)</option>
              ) : (
                qualityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Destination Folder Selector */}
        <div className="lg:col-span-5 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("options.destination")}
          </label>
          <div className="flex items-center gap-2">
            <div
              onClick={openDestinationFolder}
              className="flex-1 flex items-center gap-2 h-10 px-3.5 rounded-xl border border-border/80 bg-muted/40 text-xs font-mono text-muted-foreground truncate cursor-pointer hover:bg-muted/70 transition-colors"
              title={destinationFolder || "Default Download Folder"}
            >
              <Folder className="size-4 text-amber-500 shrink-0" />
              <span className="truncate">
                {destinationFolder || "C:\\Users\\...\\Downloads\\YouTube Downloads"}
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={browseDestinationFolder}
              disabled={isDownloading}
              className="h-10 px-3 rounded-xl border-border/80 hover:bg-muted font-medium shrink-0 cursor-pointer"
            >
              <FolderOpen className="size-4 ltr:mr-1.5 rtl:ml-1.5 text-muted-foreground" />
              {t("options.browse")}
            </Button>
          </div>
        </div>
      </div>

      {/* Playlist Actions & Batch Controls (Shown when videos are loaded) */}
      {playlistInfo && playlistInfo.videos.length > 0 && (
        <div className="mt-5 pt-4 border-t border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={allSelected ? deselectAll : selectAll}
                disabled={isDownloading}
                className="h-9 px-2.5 rounded-lg text-xs font-semibold hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {allSelected ? (
                  <>
                    <Square className="size-3.5 ltr:mr-1.5 rtl:ml-1.5 text-muted-foreground" />
                    {t("options.deselectAll")}
                  </>
                ) : (
                  <>
                    <CheckSquare className="size-3.5 ltr:mr-1.5 rtl:ml-1.5 text-red-500" />
                    {t("options.selectAll")}
                  </>
                )}
              </Button>
            </div>

            <span className="text-xs text-muted-foreground font-medium">
              {t("options.selectedCount", {
                count: selectedCount,
                total: totalVideos,
              })}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              onClick={downloadSelected}
              disabled={isDownloading || selectedCount === 0}
              className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md shadow-red-600/20 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="size-4 ltr:mr-2 rtl:ml-2 animate-spin" />
                  {t("options.downloading")}
                </>
              ) : (
                <>
                  <Download className="size-4 ltr:mr-2 rtl:ml-2" />
                  {t("options.downloadSelected", { count: selectedCount })}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

