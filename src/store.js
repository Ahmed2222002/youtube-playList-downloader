import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useStore = create()(persist((set) => ({
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
    deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
    })),
    updateTransaction: (id, data) => set((state) => ({
        transactions: state.transactions.map((t) => t.id === id ? { ...t, ...data } : t),
    })),
    resetLedger: () => set({
        people: [],
        transactions: [],
    }),
}), {
    name: "expense-tracker-storage",
}));
