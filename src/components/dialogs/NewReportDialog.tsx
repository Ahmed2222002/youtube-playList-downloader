import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useStore } from "@/store";
import { useTranslation } from "react-i18next";

export function NewReportDialog() {
  const { resetLedger } = useStore();
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger>
        <Button>{t("newReport.trigger")}</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg!">
        <DialogHeader>
          <DialogTitle>{t("newReport.title")}</DialogTitle>
          <DialogDescription>{t("newReport.description")}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose>
            <Button variant="outline">{t("newReport.cancel")}</Button>
          </DialogClose>

          <DialogClose>
            <Button onClick={resetLedger}>{t("newReport.confirm")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
