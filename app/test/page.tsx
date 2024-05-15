import NewTransactionDrawer from "./NewTransactionDrawer";

export type TCategories = {
  id: string;
  name: string;
  is_expense: boolean;
};

export type TTransactionType = "income" | "expense";

export default function TestPage() {
  return (
    <main className="space-y-5 p-5">
      <NewTransactionDrawer />
    </main>
  );
}
