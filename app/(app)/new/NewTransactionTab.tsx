import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IoAddSharp, IoRemoveSharp } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { DEFAULT_ACTIVE_TAB } from "@/lib/defaultValues";
import NewTransactionForm from "./NewTransactionForm";
import {
  TCategories,
  TTransactionType,
} from "@/lib/types/new-transaction-form-schema";

const incomeCategories: TCategories[] = [
  { id: "i5y8zFO3", name: "salary", is_expense: true },
  { id: "zPu34l3J", name: "freelance", is_expense: true },
];
const expenseCategories: TCategories[] = [
  { id: "lqIGQTiN", name: "grocery", is_expense: true },
  { id: "UH3DAtex", name: "food", is_expense: true },
  { id: "B7iLVbhN", name: "clothings", is_expense: true },
];

export default function NewTransactionTab() {
  return (
    <>
      <Tabs defaultValue={DEFAULT_ACTIVE_TAB}>
        <TabsList className="mb-3 h-fit w-fit rounded-full bg-muted/30 p-0">
          <TransactionTypeSwitchTrigger type="income" />
          <TransactionTypeSwitchTrigger type="expense" />
        </TabsList>

        <TabsContent value="income">
          <NewTransactionForm tabType="income" categories={incomeCategories} />
        </TabsContent>

        <TabsContent value="expense">
          <NewTransactionForm
            tabType="expense"
            categories={expenseCategories}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}

function TransactionTypeSwitchTrigger({ type }: { type: TTransactionType }) {
  const Icon = () => (type === "income" ? <IoAddSharp /> : <IoRemoveSharp />);

  return (
    <TabsTrigger
      value={type}
      className={cn(
        "h-9 w-12 rounded-full text-base data-[state=active]:shadow-none",
        type === "income"
          ? "data-[state=active]:bg-success data-[state=active]:text-success-foreground"
          : "data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground",
      )}
    >
      <Icon />
    </TabsTrigger>
  );
}
