import { useStore } from "@/store";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import {
  ListMusic,
  Video,
  User,
  CheckCircle2,
  Trash2,
  Download,
} from "lucide-react";

export default function PlaylistSummaryCard() {
  const { playlistInfo, clearPlaylist, isDownloading } = useStore();
  const { t } = useTranslation();

  if (!playlistInfo) return null;

  const totalVideos = playlistInfo.videos.length;
  const completedVideos = playlistInfo.videos.filter(
    (v) => v.status === "completed",
  ).length;
  const downloadingVideos = playlistInfo.videos.filter(
    (v) => v.status === "downloading",
  ).length;

  const percentCompleted =
    totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-4 md:p-6 mb-6 overflow-hidden relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {playlistInfo.thumbnail ? (
            <div className="relative size-16 md:size-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/60 shadow-xs">
              <img
                src={playlistInfo.thumbnail}
                alt={playlistInfo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-bold text-white uppercase">
                {playlistInfo.type}
              </div>
            </div>
          ) : (
            <div className="size-16 md:size-20 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0 border border-red-200 dark:border-red-900">
              {playlistInfo.type === "playlist" ? (
                <ListMusic className="size-8" />
              ) : (
                <Video className="size-8" />
              )}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase tracking-wide">
                {playlistInfo.type === "playlist"
                  ? t("summary.playlist")
                  : t("summary.singleVideo")}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {t("summary.videoCount", { count: totalVideos })}
              </span>
            </div>

            <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground truncate mt-1">
              {playlistInfo.title}
            </h2>

            {playlistInfo.uploader && (
              <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <User className="size-3.5 text-muted-foreground/70" />
                <span>{playlistInfo.uploader}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border/60">
          <div className="text-right">
            <div className="text-xs font-semibold text-muted-foreground">
              {completedVideos} / {totalVideos} Completed
            </div>
            <div className="text-sm font-bold text-foreground">
              {percentCompleted}%
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearPlaylist}
            disabled={isDownloading}
            className="h-9 px-3 rounded-xl text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            title="Clear current playlist"
          >
            <Trash2 className="size-3.5 ltr:mr-1.5 rtl:ml-1.5" />
            <span>{t("input.clear")}</span>
          </Button>
        </div>
      </div>

      {/* Overall Progress Bar during download */}
      {(isDownloading || completedVideos > 0) && (
        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span className="font-medium flex items-center gap-1.5">
              {isDownloading ? (
                <>
                  <Download className="size-3 text-red-500 animate-bounce" />
                  Downloading ({downloadingVideos} active)...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  Finished ({completedVideos} downloaded)
                </>
              )}
            </span>
            <span className="font-semibold">{percentCompleted}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-300"
              style={{ width: `${percentCompleted}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

