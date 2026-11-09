import { useStore } from "./store";
import "./App.css";

import { AddTransactionDialog } from "./components/dialogs/AddTransactionDialog";
import { TransactionTable } from "./components/TransactionTable";
import NewReportSetup from "./components/NewReportSetup";
import Header from "./components/Header";
import BalanceCard from "./components/BalanceCard";

export default function App() {
  const { people } = useStore();

  return people.length === 0 ? (
    <NewReportSetup />
  ) : (
    <div className="bg-gray-50 dark:bg-black">
      <div className="min-h-screen p-6 md:p-10 mx-auto container">
        <Header />
        <BalanceCard />
        <AddTransactionDialog />
        <TransactionTable />
      </div>
    </div>
  );
}
