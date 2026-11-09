import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

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
import { IoTrashOutline } from "react-icons/io5";

export function DeleteTransactionDialog({ transactionName, id }) {
  const { deleteTransaction } = useStore();
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger className="bg-transparent hover:bg-gray-200 duration-200 p-1 rounded-sm size-7 cursor-pointer hover:text-red-600">
        <IoTrashOutline className="size-5" />
      </DialogTrigger>

      <DialogContent className="max-w-lg!">
        <DialogHeader>
          <DialogTitle>{t("deleteTransaction.title")}</DialogTitle>

          <DialogDescription>
            {t("deleteTransaction.description", {
              name: transactionName,
            })}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose>
            <Button>{t("deleteTransaction.cancel")}</Button>
          </DialogClose>

          <DialogClose>
            <Button variant="delete" onClick={() => deleteTransaction(id)}>
              {t("deleteTransaction.delete")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
