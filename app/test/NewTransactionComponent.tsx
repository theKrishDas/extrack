import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IoAddSharp, IoRemoveSharp } from "react-icons/io5";

export type TTransactionType = "income" | "expense";

export default function NewTransactionComponent() {
  return (
    <>
      <Tabs defaultValue="expense">
        <TabsList className="h-fit w-fit rounded-full bg-card">
          <TransactionTypeSwitchTrigger type="income" />
          <TransactionTypeSwitchTrigger type="expense" />
        </TabsList>

        <TabsContent value="income">Add new income</TabsContent>
        <TabsContent value="expense">Where did you waste money</TabsContent>
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
