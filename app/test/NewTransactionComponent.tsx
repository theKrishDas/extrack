import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IoAddSharp, IoRemoveSharp } from "react-icons/io5";
import { TCategories, TTransactionType } from "./page";
import SelectComponent from "./SelectComponent";

export default function NewTransactionComponent({
  incomeCategories,
  expenseCategories,
}: {
  incomeCategories: TCategories[];
  expenseCategories: TCategories[];
}) {
  return (
    <>
      <Tabs defaultValue="expense">
        <TabsList className="h-fit w-fit rounded-full bg-card">
          <TransactionTypeSwitchTrigger type="income" />
          <TransactionTypeSwitchTrigger type="expense" />
        </TabsList>

        <TabsContent value="income">
          <SelectComponent categories={incomeCategories} />
        </TabsContent>
        <TabsContent value="expense">
          <SelectComponent categories={expenseCategories} />
        </TabsContent>
      </Tabs>
    </>
  );
}

function TransactionTypeSwitchTrigger({ type }: { type: TTransactionType }) {
  const Icon = () => (type === "income" ? <IoAddSharp /> : <IoRemoveSharp />);

  return (
    <TabsTrigger value={type} className="h-10 w-12 rounded-full text-base">
      <Icon />
    </TabsTrigger>
  );
}
