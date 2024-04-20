import {
  IoArrowUpSharp,
  IoCalendarClearOutline,
  IoRefreshSharp,
} from "react-icons/io5";
import SelectComponent from "./SelectComponent";
import { TCategories, TTransactionType } from "./page";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LuUndo2 } from "react-icons/lu";

export default function NewTransactionForm({
  type,
  categories,
}: {
  type: TTransactionType;
  categories: TCategories[];
}) {
  return (
    <TabsContent value={type} className="relative space-y-2 pt-3">
      <div className="inline-flex w-full items-center justify-between">
        <SelectComponent categories={categories} />

        <Button
          className="h-10 w-10 rounded-lg bg-card/50 text-base shadow-none"
          variant="secondary"
          size="icon"
        >
          <IoCalendarClearOutline />
        </Button>
      </div>

      {/* --- --- INPUTS --- --- */}
      <section className="flex w-full flex-col items-start justify-center gap-6 rounded-3xl bg-card p-12">
        <div className="justify-betweens inline-flex w-full items-center gap-2">
          <IoArrowUpSharp
            className={cn(
              "rotate-0 text-success transition-all",
              type === "expense" && "rotate-180 text-destructive",
            )}
          />

          <p className="font-semibolds flex-1 text-sm">Bought Keyboard</p>

          <Button
            className="h-12 w-12 rounded-full text-base"
            variant="ghost"
            size="icon"
          >
            <LuUndo2 strokeWidth={1.5} />
          </Button>
        </div>
        <div className="w-full overflow-hidden">
          <p className="truncate text-5xl font-light">1,00,000</p>
        </div>
      </section>

      {/* --- --- BUTTON --- --- */}
      <div className="flex w-full py-3">
        <Button
          size="lg"
          className={cn(
            "mx-auto rounded-full shadow-none",
            type === "income"
              ? "bg-success text-success-foreground"
              : "bg-destructive text-destructive-foreground",
          )}
        >
          Save
        </Button>
      </div>
    </TabsContent>
  );
}
