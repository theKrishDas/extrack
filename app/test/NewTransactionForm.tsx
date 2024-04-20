import { IoArrowUpSharp } from "react-icons/io5";
import SelectComponent from "./SelectComponent";
import { TCategories, TTransactionType } from "./page";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function NewTransactionForm({
  type,
  categories,
}: {
  type: TTransactionType;
  categories: TCategories[];
}) {
  return (
    <TabsContent value={type} className="relative">
      <div className="flex w-full flex-col items-start justify-center gap-6 rounded-3xl bg-card p-12">
        <div className="items-cetner inline-flex w-full justify-between">
          <p className="font-semibolds text-sm">Bought Keyboard</p>
          <IoArrowUpSharp
            className={cn(
              "rotate-0 text-success transition-all",
              type === "expense" && "rotate-180 text-destructive",
            )}
          />
        </div>
        <div className="w-full overflow-hidden">
          <p className="truncate text-6xl font-extralight">1,00,000</p>
        </div>
      </div>
      <div className="flex w-full py-5">
        <Button
          className={cn(
            "mx-auto rounded-full",
            type === "income"
              ? "bg-success text-success-foreground"
              : "bg-destructive text-destructive-foreground",
          )}
        >
          Save
        </Button>
      </div>
      <SelectComponent categories={categories} />
    </TabsContent>
  );
}
