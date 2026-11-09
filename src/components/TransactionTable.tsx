import { format } from "date-fns";
import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store";
import { EditTransactionDialog } from "./dialogs/EditTransactionDialog";
import { DeleteTransactionDialog } from "./dialogs/DeleteTransactionDialog";
import { formatAmount } from "@/utils/helpers";

export function TransactionTable() {
  const { transactions, people } = useStore();
  const { t } = useTranslation();

  const personTotals = people.map((_, index) =>
    transactions.reduce((sum, t) => sum + (t.shares?.[index] ?? 0), 0),
  );

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

  return transactions.length !== 0 ? (
    <div className="bg-white rounded-3xl shadow-md border border-zinc-200 p-4 md:p-6">
      <div className="rounded-md border border-zinc-800 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-black text-white">
              <TableHead className="text-center  ltr:border-r rtl:border-l border-gray-300 ltr:last:border-r-0 rtl:last:border-l-0">
                {t("transactionTable.date")}
              </TableHead>

              <TableHead className="text-center  ltr:border-r rtl:border-l border-gray-300 ltr:last:border-r-0 rtl:last:border-l-0">
                {t("transactionTable.description")}
              </TableHead>

              <TableHead className="text-center  ltr:border-r rtl:border-l border-gray-300 ltr:last:border-r-0 rtl:last:border-l-0">
                {t("transactionTable.type")}
              </TableHead>

              <TableHead className="text-center  ltr:border-r rtl:border-l border-gray-300 ltr:last:border-r-0 rtl:last:border-l-0">
                {t("transactionTable.total")}
              </TableHead>

              {people.map((person, index) => (
                <TableHead
                  key={index}
                  className="text-center  ltr:border-r rtl:border-l border-gray-300 ltr:last:border-r-0 rtl:last:border-l-0"
                >
                  {person}
                </TableHead>
              ))}

              <TableHead className="text-center  ltr:border-r rtl:border-l border-gray-300 ltr:last:border-r-0 rtl:last:border-l-0">
                {t("transactionTable.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.map((tItem) => (
              <TableRow
                key={tItem.id}
                className="hover:bg-gray-50 even:bg-gray-100 odd:bg-white"
              >
                <TableCell className="text-center  ltr:border-r rtl:border-l border-gray-300 ltr:last:border-r-0 rtl:last:border-l-0 font-medium">
                  {tItem.date ? (
                    format(new Date(tItem.date), "dd MMM yyyy")
                  ) : (
                    <span className="italic text-zinc-500">
                      {t("transactionTable.unknown")}
                    </span>
                  )}
                </TableCell>

                <TableCell className="text-center  ltr:border-r rtl:border-l border-gray-300 ltr:last:border-r-0 rtl:last:border-l-0">
                  {tItem.cause}
                </TableCell>

                <TableCell className="text-center  ltr:border-r rtl:border-l border-gray-300 ltr:last:border-r-0 rtl:last:border-l-0">
                  <Badge
                    className={
                      tItem.type === "income" ? "bg-green-600" : "bg-red-600"
                    }
                  >
                    {tItem.type === "income"
                      ? t("transactionTable.income")
                      : t("transactionTable.expense")}
                  </Badge>
                </TableCell>

                <TableCell className="text-center  ltr:border-r rtl:border-l border-gray-300 ltr:last:border-r-0 rtl:last:border-l-0">
                  <span
                    className={
                      tItem.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {tItem.type === "income" && tItem.amount !== 0 ? "+" : ""}
                    {formatAmount(tItem.amount)}
                  </span>
                </TableCell>

                {people.map((_, index) => {
                  const value = tItem.shares?.[index] ?? 0;

                  return (
                    <TableCell
                      key={index}
                      className="text-center  ltr:border-r rtl:border-l border-gray-300 ltr:last:border-r-0 rtl:last:border-l-0"
                    >
                      <span
                        className={
                          tItem.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {tItem.type === "income" && value !== 0 ? "+" : ""}
                        {formatAmount(value)}
                      </span>
                    </TableCell>
                  );
                })}

                <TableCell className="flex gap-2 justify-center">
                  <EditTransactionDialog transaction={tItem} />
                  <DeleteTransactionDialog
                    transactionName={tItem.cause}
                    id={tItem.id}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow className="border-t bg-black text-white font-semibold">
              <TableCell
                className="text-center  ltr:border-r rtl:border-l border-gray-300 ltr:last:border-r-0 rtl:last:border-l-0"
                colSpan={3}
              >
                {t("transactionTable.summary")}
              </TableCell>

              <TableCell className="text-center border-x border-gray-300 ltr:last:border-r-0 rtl:last:border-l-0">
                {totalAmount >= 0 && totalAmount !== 0 ? "+" : ""}
                {formatAmount(totalAmount)}
              </TableCell>

              {personTotals.map((total, i) => (
                <TableCell
                  key={i}
                  className="text-center  ltr:border-r rtl:border-l border-gray-300 ltr:last:border-r-0 rtl:last:border-l-0"
                >
                  {total >= 0 && total !== 0 ? "+" : ""}
                  {formatAmount(total)}
                </TableCell>
              ))}

              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  ) : (
    <div className="bg-white rounded-3xl shadow-md border border-zinc-200 p-4 md:p-6">
      <div className="text-center py-12 text-zinc-500">
        {t("transactionTable.empty")}
      </div>
    </div>
  );
}
