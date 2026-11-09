import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction } from "./types";

interface Store {
  people: string[];
  transactions: Transaction[];
  setPeople: (people: string[]) => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, data: Omit<Transaction, "id">) => void;
  resetLedger: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      people: [],

      transactions: [],

      setPeople: (people) => set({ people }),

      addTransaction: (t) => {
        const newTransaction = {
          ...t,
          id: Date.now().toString(),
        };

        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      updateTransaction: (id, data) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...data } : t,
          ),
        })),

      resetLedger: () =>
        set({
          people: [],
          transactions: [],
        }),
    }),
    {
      name: "expense-tracker-storage",
    },
  ),
);
