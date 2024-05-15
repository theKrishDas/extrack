import { TabsTrigger } from "@/components/ui/tabs";
import { IoAddSharp, IoRemoveSharp } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { TTransactionType } from "@/lib/types/new-transaction-form-schema";

export default function TransactionTypeSwitchTrigger({
  type,
}: {
  type: TTransactionType;
}) {
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
