import NewTransactionForm from "./NewTransactionForm";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { DEFAULT_ACTIVE_TAB } from "@/lib/defaultValues";
import { TCategories } from "@/lib/types/new-transaction-form-schema";
import TransactionTypeSwitchTrigger from "@/components/newTransaction/TransactionTypeSwitchTrigger";

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
