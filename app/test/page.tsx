import SelectComponent from "./SelectComponent";

export type TCategories = {
  id: string;
  name: string;
  is_expense: boolean;
};

const expenseCategories: TCategories[] = [
  { id: "lqIGQTiN", name: "grocery", is_expense: true },
  { id: "UH3DAtex", name: "food", is_expense: true },
  { id: "B7iLVbhN", name: "clothings", is_expense: true },
];

export default function TestPage() {
  return (
    <main className="space-y-5 p-5">
      <SelectComponent categories={expenseCategories} />
    </main>
  );
}
