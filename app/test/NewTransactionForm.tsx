"use client";

import { cn } from "@/lib/utils";
import { IoArrowUpSharp, IoCalendarClearOutline } from "react-icons/io5";
import SelectComponent from "./SelectComponent";
import { TCategories, TTransactionType } from "./page";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LuUndo2 } from "react-icons/lu";
import CurrencyInput from "react-currency-input-field";

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

        <div className="space-x-1">
          <Button
            className="h-10 w-10 rounded-lg bg-card/50 text-base shadow-none"
            variant="secondary"
            size="icon"
          >
            <IoCalendarClearOutline />
          </Button>

          <Button
            className="h-10 w-10 rounded-lg text-base shadow-none"
            variant="ghost"
            size="icon"
          >
            <LuUndo2 strokeWidth={1.75} />
          </Button>
        </div>
      </div>

      {/* --- --- INPUTS --- --- */}
      <section className="flex w-full flex-col items-start justify-center gap-8 rounded-3xl bg-card p-10">
        <div className="justify-betweens inline-flex w-full items-center">
          <input
            className="min-w-0 flex-1 border-none text-lg outline-none"
            placeholder="Add a Label"
          />

          <IoArrowUpSharp
            size={16}
            className={cn(
              "rotate-0 text-success transition-all",
              type === "expense" && "rotate-180 text-destructive",
            )}
          />
        </div>

        <CurrencyInput
          decimalsLimit={2}
          allowNegativeValue={false}
          maxLength={8}
          placeholder="Amount"
          className="w-full truncate border-none text-5xl font-light tracking-tight outline-none"
        />
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
          Add
        </Button>
      </div>
    </TabsContent>
  );
}
