import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { className: "bg-white rounded-3xl shadow-lg p- md:p-8 mb-8 border border-gray-200", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("p", { className: "text-2xl text-gray-900 font-medium", children: t("balanceCard.netBalance") }), _jsxs("p", { className: `text-4xl md:text-5xl font-medium tracking-tight ${net >= 0 ? "text-green-600" : "text-red-600"}`, children: [net > 0 && net !== 0 ? "+" : "", formatAmount(net), " ", getCurrencySymbol()] })] }), _jsxs("div", { className: "text-center text-gray-900 font-medium", children: [_jsx("p", { children: t("balanceCard.people") }), _jsx("p", { children: people.length })] })] }), _jsxs("div", { className: "flex gap-10 mt-6 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-700 font-medium", children: t("balanceCard.income") }), _jsxs("p", { className: "text-green-600 font-semibold", children: [totalIncome !== 0 ? "+" : "", formatAmount(totalIncome), " ", getCurrencySymbol()] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-700 font-medium", children: t("balanceCard.expenses") }), _jsxs("p", { className: "text-red-600 font-semibold", children: [formatAmount(totalExpense), " ", getCurrencySymbol()] })] })] }), _jsxs("div", { className: "mt-6 border-t pt-4", children: [_jsx("p", { className: " text-gray-900 font-bold mb-2", children: t("balanceCard.perPersonBalance") }), _jsx("div", { className: "space-y-1", children: personTotals.map((p, i) => (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-700 font-medium", children: p.person }), _jsxs("span", { className: p.total >= 0 ? "text-green-600" : "text-red-600", children: [p.total > 0 && p.total !== 0 ? "+" : "", formatAmount(p.total), " ", getCurrencySymbol()] })] }, i))) })] }), people.length > 0 && transactions.length !== 0 && (_jsxs("div", { className: "mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm", children: [_jsx("p", { className: "mb-4 text-xs font-medium uppercase tracking-wide text-gray-500", children: t("balanceCard.insight") }), _jsxs("div", { className: "flex w-full items-center gap-5", children: [_jsxs("div", { className: "basis-1/2 rounded-xl bg-gray-50 p-3 flex items-center gap-10", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: t("balanceCard.highestBalance") }), _jsx("p", { className: "mt-1 text-sm font-semibold text-gray-800", children: richest.person })] }), _jsxs("p", { className: `text-2xl font-medium ${richest.total >= 0 ? "text-green-600" : "text-red-600"}`, children: [formatAmount(richest.total), " ", getCurrencySymbol()] })] }), _jsxs("div", { className: "basis-1/2 rounded-xl bg-gray-50 p-3 flex items-center gap-10", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: t("balanceCard.lowestBalance") }), _jsx("p", { className: "mt-1 text-sm font-semibold text-gray-800", children: poorest.person })] }), _jsxs("p", { className: `text-2xl font-medium ${poorest.total >= 0 ? "text-green-600" : "text-red-600"}`, children: [formatAmount(poorest.total), " ", getCurrencySymbol()] })] })] })] }))] }));
}
