import NewTransactionComponent from "./NewTransactionComponent";

export type TCategories = {
  id: string;
  name: string;
  is_expense: boolean;
};

export type TTransactionType = "income" | "expense";

const incomeCategories: TCategories[] = [
  { id: "i5y8zFO3", name: "salary", is_expense: true },
  { id: "zPu34l3J", name: "freelance", is_expense: true },
];
const expenseCategories: TCategories[] = [
  { id: "lqIGQTiN", name: "grocery", is_expense: true },
  { id: "UH3DAtex", name: "food", is_expense: true },
  { id: "B7iLVbhN", name: "clothings", is_expense: true },
];

export default function TestPage() {
  return (
    <main className="space-y-5 p-5">
      <NewTransactionComponent
        incomeCategories={incomeCategories}
        expenseCategories={expenseCategories}
      />
    </main>
  );
}
