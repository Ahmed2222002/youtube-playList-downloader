import React, { useState } from "react";
import { useStore } from "@/store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useTranslation } from "react-i18next";
import { isValidYouTubeUrl } from "@/utils/helpers";
import { Search, Clipboard, X, Loader2, AlertCircle } from "lucide-react";

export default function UrlInputSection() {
  const { url, setUrl, fetchInfo, isFetching, fetchError, isDownloading } = useStore();
  const { t } = useTranslation();
  const [localValidation, setLocalValidation] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setLocalValidation(null);
      }
    } catch (err) {
      console.warn("Could not read clipboard", err);
    }
  };

  const handleClear = () => {
    setUrl("");
    setLocalValidation(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setLocalValidation(t("input.invalidUrl"));
      return;
    }
    if (!isValidYouTubeUrl(trimmed)) {
      setLocalValidation(t("input.invalidUrl"));
      return;
    }
    setLocalValidation(null);
    fetchInfo(trimmed);
  };

  const errorMessage = localValidation || fetchError;

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-4 md:p-6 mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 ltr:left-3.5 rtl:right-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Search className="size-5" />
            </div>

            <Input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (localValidation) setLocalValidation(null);
              }}
              placeholder={t("input.placeholder")}
              disabled={isFetching || isDownloading}
              className="h-12 ltr:pl-11 rtl:pr-11 ltr:pr-20 rtl:pl-20 text-sm md:text-base rounded-xl border-border/80 focus-visible:ring-red-500 shadow-none transition-all"
            />

            <div className="absolute inset-y-0 ltr:right-2.5 rtl:left-2.5 flex items-center gap-1">
              {url && !isFetching && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  title={t("input.clear")}
                >
                  <X className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={handlePaste}
                disabled={isFetching || isDownloading}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title={t("input.paste")}
              >
                <Clipboard className="size-4" />
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isFetching || !url.trim() || isDownloading}
            className="h-12 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md shadow-red-600/20 active:translate-y-0.5 transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isFetching ? (
              <>
                <Loader2 className="size-4 ltr:mr-2 rtl:ml-2 animate-spin" />
                {t("input.fetching")}
              </>
            ) : (
              <>
                <Search className="size-4 ltr:mr-2 rtl:ml-2" />
                {t("input.fetch")}
              </>
            )}
          </Button>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 p-3 text-sm rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 animate-in fade-in duration-200">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
}

