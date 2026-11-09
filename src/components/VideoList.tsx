import { useState, useMemo } from "react";
import { useStore } from "@/store";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Checkbox } from "./ui/checkbox";
import { useTranslation } from "react-i18next";
import { VideoItem } from "@/types";
import {
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  HardDrive,
  RefreshCw,
  Zap,
  Search,
  X,
  Filter,
} from "lucide-react";

export default function VideoList() {
  const {
    playlistInfo,
    selectedUrls,
    toggleSelectVideo,
    downloadSingle,
    isDownloading,
  } = useStore();

  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const videos = playlistInfo?.videos;

  // Filter videos based on search query and status filter
  const filteredVideosWithIndex = useMemo(() => {
    if (!videos) return [];

    return videos
      .map((video, index) => ({ video, originalIndex: index }))
      .filter(({ video }) => {
        // Search filter
        if (
          searchQuery.trim() &&
          !video.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
        ) {
          return false;
        }

        // Status filter
        if (statusFilter === "all") return true;
        if (statusFilter === "selected") return selectedUrls.includes(video.url);
        if (statusFilter === "completed") return video.status === "completed";
        if (statusFilter === "downloading") return video.status === "downloading";
        if (statusFilter === "queued") return video.status === "queued";
        if (statusFilter === "error") return video.status === "error";
        if (statusFilter === "ready")
          return (
            video.status === "idle" ||
            (!video.status && !selectedUrls.includes(video.url))
          );

        return true;
      });
  }, [videos, searchQuery, statusFilter, selectedUrls]);

  if (!playlistInfo || playlistInfo.videos.length === 0) return null;

  const totalVideos = playlistInfo.videos.length;

  // Status counts for filtering
  const completedCount = playlistInfo.videos.filter(
    (v) => v.status === "completed",
  ).length;
  const downloadingCount = playlistInfo.videos.filter(
    (v) => v.status === "downloading",
  ).length;
  const queuedCount = playlistInfo.videos.filter(
    (v) => v.status === "queued",
  ).length;
  const errorCount = playlistInfo.videos.filter((v) => v.status === "error").length;
  const selectedCount = selectedUrls.length;

  const hasActiveFilters = searchQuery.trim() !== "" || statusFilter !== "all";

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-sm overflow-hidden mb-8">
      {/* Top Filter and Search Bar using Shadcn Input & Select */}
      <div className="p-3.5 md:p-4 bg-muted/30 border-b border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("filter.searchPlaceholder") || "Search videos in playlist..."}
            className="h-9 ltr:pl-9 rtl:pr-9 ltr:pr-8 rtl:pl-8 rounded-xl border-border/80 bg-background text-xs md:text-sm shadow-none focus-visible:ring-red-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute ltr:right-2.5 rtl:left-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Status Filter using Shadcn Select */}
          <div className="w-44 shrink-0">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 rounded-xl border-border/80 bg-background text-xs font-medium focus-visible:ring-red-500 shadow-none">
                <div className="flex items-center gap-1.5 truncate">
                  <Filter className="size-3 text-muted-foreground shrink-0" />
                  <SelectValue placeholder={t("filter.all")} />
                </div>
              </SelectTrigger>
              <SelectContent position="popper" className="rounded-xl border-border/80 shadow-lg text-xs">
                <SelectItem value="all">
                  {t("filter.all")} ({totalVideos})
                </SelectItem>
                <SelectItem value="selected">
                  {t("filter.selected")} ({selectedCount})
                </SelectItem>
                {completedCount > 0 && (
                  <SelectItem value="completed">
                    {t("filter.completed")} ({completedCount})
                  </SelectItem>
                )}
                {downloadingCount > 0 && (
                  <SelectItem value="downloading">
                    {t("filter.downloading")} ({downloadingCount})
                  </SelectItem>
                )}
                {queuedCount > 0 && (
                  <SelectItem value="queued">
                    {t("filter.queued")} ({queuedCount})
                  </SelectItem>
                )}
                {errorCount > 0 && (
                  <SelectItem value="error">
                    {t("filter.failed")} ({errorCount})
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="text-xs text-muted-foreground whitespace-nowrap hidden lg:block font-medium">
            {t("filter.showingCount", {
              count: filteredVideosWithIndex.length,
              total: totalVideos,
            })}
          </div>
        </div>
      </div>

      {/* Table Header (Fixed Above ScrollArea) */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-muted/60 border-b border-border/60 text-xs font-semibold uppercase tracking-wider text-muted-foreground items-center shrink-0">
        <div className="col-span-1 flex items-center gap-3">
          <span className="w-6 text-center">{t("list.index")}</span>
        </div>
        <div className="col-span-6">{t("list.video")}</div>
        <div className="col-span-3">{t("list.status")}</div>
        <div className="col-span-2 text-right">{t("list.actions")}</div>
      </div>

      {/* Video Rows in Shadcn ScrollArea */}
      <ScrollArea
        className={
          totalVideos > 4
            ? "h-[540px] max-h-[70vh] w-full"
            : "w-full"
        }
      >
        {filteredVideosWithIndex.length === 0 ? (
          <div className="py-12 px-4 text-center flex flex-col items-center justify-center gap-2.5 text-muted-foreground">
            <Search className="size-8 opacity-40 text-muted-foreground" />
            <p className="text-sm font-medium">
              {t("filter.noResults")}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="mt-1 h-8 rounded-lg text-xs font-semibold border-border/80"
              >
                {t("filter.reset")}
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filteredVideosWithIndex.map(({ video, originalIndex }) => {
              const isSelected = selectedUrls.includes(video.url);

              return (
                <VideoRowItem
                  key={video.id || video.url || originalIndex}
                  video={video}
                  index={originalIndex}
                  isSelected={isSelected}
                  onToggleSelect={() => toggleSelectVideo(video.url)}
                  onDownload={() => downloadSingle(video.url)}
                  isGlobalDownloading={isDownloading}
                />
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

interface VideoRowProps {
  video: VideoItem;
  index: number;
  isSelected: boolean;
  onToggleSelect: () => void;
  onDownload: () => void;
  isGlobalDownloading: boolean;
}

function VideoRowItem({
  video,
  index,
  isSelected,
  onToggleSelect,
  onDownload,
  isGlobalDownloading,
}: VideoRowProps) {
  const { t } = useTranslation();

  const isDownloadingThis = video.status === "downloading";
  const isQueued = video.status === "queued";
  const isCompleted = video.status === "completed";
  const isError = video.status === "error";

  return (
    <div
      className={`p-4 md:px-6 md:py-4 transition-colors flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center ${
        isSelected ? "bg-muted/20" : "hover:bg-muted/10"
      }`}
    >
      {/* Checkbox and Index */}
      <div className="flex items-center gap-3 w-full md:w-auto md:col-span-1 shrink-0">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          disabled={isGlobalDownloading}
        />
        <span className="text-xs font-mono font-bold text-muted-foreground w-6 text-center">
          #{index + 1}
        </span>
      </div>

      {/* Thumbnail + Details */}
      <div className="flex items-start sm:items-center gap-3.5 w-full md:col-span-6 min-w-0">
        <div className="relative w-28 sm:w-32 aspect-video rounded-xl overflow-hidden bg-muted shrink-0 border border-border/60 shadow-2xs group">
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs">
              No preview
            </div>
          )}

          {video.duration && (
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/80 text-[10px] font-mono font-semibold text-white tracking-tight">
              {video.duration}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4
            className="text-sm font-semibold text-foreground line-clamp-2 leading-snug"
            title={video.title}
          >
            {video.title}
          </h4>

          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
            {video.duration && (
              <span className="flex items-center gap-1 font-mono">
                <Clock className="size-3 text-muted-foreground/70" />
                {video.duration}
              </span>
            )}

            {video.size && (
              <span className="flex items-center gap-1 font-mono">
                <HardDrive className="size-3 text-muted-foreground/70" />
                {video.size}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Status & Progress Bar */}
      <div className="w-full md:col-span-3 flex flex-col justify-center gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <div>
            {isDownloadingThis && (
              <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-semibold gap-1">
                <Loader2 className="size-3 animate-spin" />
                {t("options.downloading")}
              </Badge>
            )}

            {isQueued && (
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold">
                {t("list.queued")}
              </Badge>
            )}

            {isCompleted && (
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold gap-1">
                <CheckCircle2 className="size-3" />
                {t("list.completed")}
              </Badge>
            )}

            {isError && (
              <Badge className="bg-destructive/10 text-destructive border border-destructive/20 font-semibold gap-1">
                <AlertCircle className="size-3" />
                {t("list.failed")}
              </Badge>
            )}

            {!isDownloadingThis && !isQueued && !isCompleted && !isError && (
              <span className="text-muted-foreground text-xs font-medium">
                Ready
              </span>
            )}
          </div>

          {(isDownloadingThis || isCompleted) && (
            <span className="text-xs font-bold font-mono text-foreground">
              {Math.round(video.progress)}%
            </span>
          )}
        </div>

        {/* Live Progress Bar */}
        {(isDownloadingThis || isCompleted) && (
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-200 ${
                isCompleted
                  ? "bg-emerald-500"
                  : "bg-gradient-to-r from-red-600 to-rose-500"
              }`}
              style={{ width: `${video.progress}%` }}
            />
          </div>
        )}

        {/* Speed & ETA stats */}
        {isDownloadingThis && (video.speed || video.eta) && (
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            {video.speed && (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
                <Zap className="size-2.5" />
                {video.speed}
              </span>
            )}
            {video.eta && <span>ETA: {video.eta}</span>}
          </div>
        )}

        {isError && video.error && (
          <p className="text-[11px] text-destructive truncate" title={video.error}>
            {video.error}
          </p>
        )}
      </div>

      {/* Action Button */}
      <div className="w-full md:col-span-2 flex items-center justify-end shrink-0">
        {isCompleted ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDownload}
            disabled={isGlobalDownloading}
            className="h-8 px-2.5 rounded-lg text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
          >
            <CheckCircle2 className="size-3.5 ltr:mr-1.5 rtl:ml-1.5" />
            {t("list.completed")}
          </Button>
        ) : isError ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDownload}
            disabled={isGlobalDownloading}
            className="h-8 px-3 rounded-lg text-xs font-semibold border-destructive/40 text-destructive hover:bg-destructive/10 cursor-pointer"
          >
            <RefreshCw className="size-3 ltr:mr-1.5 rtl:ml-1.5" />
            {t("list.retry")}
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDownload}
            disabled={isGlobalDownloading || isDownloadingThis}
            className="h-8 px-3 rounded-lg text-xs font-semibold border-border/80 hover:bg-muted cursor-pointer"
          >
            {isDownloadingThis ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <>
                <Download className="size-3 ltr:mr-1.5 rtl:ml-1.5 text-red-600" />
                {t("list.download")}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
