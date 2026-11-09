import { useTranslation } from "react-i18next";
import { ListMusic, Sparkles, Zap, Play } from "lucide-react";

export default function EmptyState() {
  const { t } = useTranslation();

  return (
    // <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-8 md:p-12 text-center max-w-3xl mx-auto">
    <div className="bg-card rounded-2xl border border-border/80 shadow-sm p-8 md:p-12 text-center mx-auto">
      <div className="size-12 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-6 shadow-md shadow-red-500/10 border border-red-200 dark:border-red-900/60">
        <Play className="size-5 " />
      </div>

      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mb-2">
        {t("empty.title")}
      </h3>

      <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto mb-8">
        {t("empty.description")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="p-4 rounded-xl bg-muted/40 border border-border/60 flex flex-col gap-2">
          <div className="size-8 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
            <ListMusic className="size-4" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">
            {t("empty.feature1Title")}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("empty.feature1Desc")}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-muted/40 border border-border/60 flex flex-col gap-2">
          <div className="size-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <Sparkles className="size-4" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">
            {t("empty.feature2Title")}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("empty.feature2Desc")}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-muted/40 border border-border/60 flex flex-col gap-2">
          <div className="size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <Zap className="size-4" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">
            {t("empty.feature3Title")}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("empty.feature3Desc")}
          </p>
        </div>
      </div>
    </div>
  );
}
