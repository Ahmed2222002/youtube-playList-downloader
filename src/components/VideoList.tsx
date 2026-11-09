import { useStore } from "@/store";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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

  if (!playlistInfo || playlistInfo.videos.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-sm overflow-hidden mb-8">
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-muted/60 border-b border-border/60 text-xs font-semibold uppercase tracking-wider text-muted-foreground items-center">
        <div className="col-span-1 flex items-center gap-3">
          <span className="w-6 text-center">{t("list.index")}</span>
        </div>
        <div className="col-span-6">{t("list.video")}</div>
        <div className="col-span-3">{t("list.status")}</div>
        <div className="col-span-2 text-right">{t("list.actions")}</div>
      </div>

      {/* Video Rows */}
      <div className="divide-y divide-border/60">
        {playlistInfo.videos.map((video, index) => {
          const isSelected = selectedUrls.includes(video.url);

          return (
            <VideoRowItem
              key={video.id || index}
              video={video}
              index={index}
              isSelected={isSelected}
              onToggleSelect={() => toggleSelectVideo(video.url)}
              onDownload={() => downloadSingle(video.url)}
              isGlobalDownloading={isDownloading}
            />
          );
        })}
      </div>
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
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          disabled={isGlobalDownloading}
          className="size-4 rounded border-border text-red-600 focus:ring-red-500 cursor-pointer disabled:opacity-50"
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

