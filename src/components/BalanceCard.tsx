import { useStore } from "@/store";
import { formatAmount, getCurrencySymbol } from "@/utils/helpers";
import { useTranslation } from "react-i18next";

export default function BalanceCard() {
  const { transactions, people } = useStore();
  const { t } = useTranslation();

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // total Expenses => negative value & total Income => positive value
  const net = totalIncome + totalExpense;

  // 👇 per-person calculation
  const personTotals = people.map((person, index) => {
    const total = transactions.reduce((sum, t) => {
      return sum + (t.shares?.[index] ?? 0);
    }, 0);

    return { person, total };
  });

  const richest = [...personTotals].sort((a, b) => b.total - a.total)[0];
  const poorest = [...personTotals].sort((a, b) => a.total - b.total)[0];

  return (
    <div className="bg-white rounded-3xl shadow-lg p- md:p-8 mb-8 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-2xl text-gray-900 font-medium">
            {t("balanceCard.netBalance")}
          </p>

          <p
            className={`text-4xl md:text-5xl font-medium tracking-tight ${
              net >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {net > 0 && net !== 0 ? "+" : ""}
            {formatAmount(net)} {getCurrencySymbol()}
          </p>
        </div>

        <div className="text-center text-gray-900 font-medium">
          <p>{t("balanceCard.people")}</p>
          <p>{people.length}</p>
        </div>
      </div>

      {/* Income / Expense */}
      <div className="flex gap-10 mt-6 text-sm">
        <div>
          <p className="text-gray-700 font-medium">{t("balanceCard.income")}</p>
          <p className="text-green-600 font-semibold">
            {totalIncome !== 0 ? "+" : ""}
            {formatAmount(totalIncome)} {getCurrencySymbol()}
          </p>
        </div>

        <div>
          <p className="text-gray-700 font-medium">
            {t("balanceCard.expenses")}
          </p>
          <p className="text-red-600 font-semibold">
            {formatAmount(totalExpense)} {getCurrencySymbol()}
          </p>
        </div>
      </div>

      {/* Per person summary */}
      <div className="mt-6 border-t pt-4">
        <p className=" text-gray-900 font-bold mb-2">
          {t("balanceCard.perPersonBalance")}
        </p>

        <div className="space-y-1">
          {personTotals.map((p, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-700 font-medium">{p.person}</span>
              <span
                className={p.total >= 0 ? "text-green-600" : "text-red-600"}
              >
                {p.total > 0 && p.total !== 0 ? "+" : ""}
                {formatAmount(p.total)} {getCurrencySymbol()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Insight section */}
      {people.length > 0 && transactions.length !== 0 && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-500">
            {t("balanceCard.insight")}
          </p>

          <div className="flex w-full items-center gap-5">
            <div className="basis-1/2 rounded-xl bg-gray-50 p-3 flex items-center gap-10">
              <div>
                <p className="text-gray-500">
                  {t("balanceCard.highestBalance")}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {richest.person}
                </p>
              </div>

              <p
                className={`text-2xl font-medium ${
                  richest.total >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatAmount(richest.total)} {getCurrencySymbol()}
              </p>
            </div>

            <div className="basis-1/2 rounded-xl bg-gray-50 p-3 flex items-center gap-10">
              <div>
                <p className="text-gray-500">
                  {t("balanceCard.lowestBalance")}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {poorest.person}
                </p>
              </div>

              <p
                className={`text-2xl font-medium ${
                  poorest.total >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatAmount(poorest.total)} {getCurrencySymbol()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
