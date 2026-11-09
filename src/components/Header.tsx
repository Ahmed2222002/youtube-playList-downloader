import { useStore } from "@/store";
import ExportExcel from "./ExportExcel";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { IoLanguage } from "react-icons/io5";
import { NewReportDialog } from "./dialogs/NewReportDialog";

export default function Header() {
  const { transactions, people } = useStore();

  const { t, i18n } = useTranslation("header");

  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  function toggleLanguage() {
    const currentLang = localStorage.getItem("language") || "en";
    const newLang = currentLang === "en" ? "ar" : "en";

    localStorage.setItem("language", newLang);
    i18n.changeLanguage(newLang);
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
        {t("header.transactionsReport")}
      </h1>
      <div className="flex gap-3 mt-4 md:mt-0 flex-wrap">
        <NewReportDialog />
        <ExportExcel transactions={transactions} people={people} />

        <Button onClick={toggleLanguage} className="size-10">
          <IoLanguage className="size-5 shrink-0" />
        </Button>
      </div>
    </div>
  );
}
