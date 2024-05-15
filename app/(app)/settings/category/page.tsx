import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_ACTIVE_TAB } from "@/lib/defaultValues";
import {
  TCategories,
  TTransactionType,
} from "@/lib/types/new-transaction-form-schema";
import { cn } from "@/lib/utils";
import { IoAddSharp, IoRemoveSharp } from "react-icons/io5";
import CategoryTabContent from "./CategoryTabContent";
import { getAllCategories } from "@/actions/handle-category";

export default async function CategorySettingsPage() {
  const incomeCategoryData = await getAllCategories(false);
  const expenseCategoryData = await getAllCategories(true);

  const incomeCategories: TCategories[] | undefined =
    incomeCategoryData.categories;

  const expenseCategories: TCategories[] | undefined =
    expenseCategoryData.categories;

  if (!incomeCategories || !expenseCategories)
    return <p>Error Fetching categories</p>;

  return (
    <>
      <Tabs defaultValue={DEFAULT_ACTIVE_TAB} className="relative">
        <TabsList className="h-fit w-fit rounded-full bg-muted/30 p-0">
          <TransactionTypeSwitchTrigger type="income" />
          <TransactionTypeSwitchTrigger type="expense" />
        </TabsList>

        <CategoryTabContent type="income" categories={incomeCategories} />
        <CategoryTabContent type="expense" categories={expenseCategories} />
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
        "h-10 w-12 rounded-full text-base data-[state=active]:bg-card data-[state=active]:shadow-none",
        type === "income"
          ? "data-[state=active]:text-success"
          : "data-[state=active]:text-destructive",
      )}
    >
      <Icon />
    </TabsTrigger>
  );
}
