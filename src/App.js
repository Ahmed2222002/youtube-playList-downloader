import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useStore } from "./store";
import "./App.css";
import { AddTransactionDialog } from "./components/dialogs/AddTransactionDialog";
import { TransactionTable } from "./components/TransactionTable";
import NewReportSetup from "./components/NewReportSetup";
import Header from "./components/Header";
import BalanceCard from "./components/BalanceCard";
export default function App() {
    const { people } = useStore();
    return people.length === 0 ? (_jsx(NewReportSetup, {})) : (_jsx("div", { className: "bg-gray-50 dark:bg-black", children: _jsxs("div", { className: "min-h-screen p-6 md:p-10 mx-auto container", children: [_jsx(Header, {}), _jsx(BalanceCard, {}), _jsx(AddTransactionDialog, {}), _jsx(TransactionTable, {})] }) }));
}
