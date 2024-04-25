import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IoAddSharp, IoRemoveSharp } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { DEFAULT_ACTIVE_TAB } from "@/lib/defaultValues";
import NewTransactionForm from "./NewTransactionForm";
import {
  TCategories,
  TTransactionType,
} from "@/lib/types/new-transaction-form-schema";

export default async function NewTransactionTab() {
  const getAllCategories = await import("@/actions/handle-category").then(
    (_) => _.getAllCategories,
  );

  const incomeCategoryData = await getAllCategories(false);
  const expenseCategoryData = await getAllCategories(true);

  const incomeCategories: TCategories[] | undefined =
    incomeCategoryData.categories;

  const expenseCategories: TCategories[] | undefined =
    expenseCategoryData.categories;

  if (!incomeCategories || !expenseCategories) return;

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
