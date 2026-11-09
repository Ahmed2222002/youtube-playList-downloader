export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  cause: string;
  date: string | null; // ISO string or null = "unknown"
  shares: number[];
}
