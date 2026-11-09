import { useStore } from "@/store";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Youtube, FolderOpen, Globe, Play } from "lucide-react";

export default function Header() {
  const { openDestinationFolder, destinationFolder } = useStore();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  function toggleLanguage() {
    const currentLang = i18n.language || "en";
    const newLang = currentLang === "en" ? "ar" : "en";
    localStorage.setItem("language", newLang);
    i18n.changeLanguage(newLang);
  }

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-border/70">
      <div className="flex items-center gap-3">
        <div className="size-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 shrink-0">
          <Play className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            {t("app.title")}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-semibold tracking-normal border border-red-200 dark:border-red-900">
              PRO
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("app.subtitle")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={openDestinationFolder}
          title={destinationFolder || "Open Download Folder"}
          className="h-10 px-3.5 rounded-xl text-sm font-medium border-border/80 hover:bg-muted"
        >
          <FolderOpen className="size-4 ltr:mr-2 rtl:ml-2 text-amber-500" />
          <span>{t("options.openFolder")}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="h-10 px-3.5 rounded-xl text-sm font-medium border-border/80 hover:bg-muted"
          title={t("app.language")}
        >
          <Globe className="size-4 ltr:mr-2 rtl:ml-2 text-blue-500" />
          <span>{i18n.language === "ar" ? "English" : "العربية"}</span>
        </Button>
      </div>
    </header>
  );
}
