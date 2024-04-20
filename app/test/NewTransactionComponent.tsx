"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IoAddSharp, IoRemoveSharp } from "react-icons/io5";
import { TCategories, TTransactionType } from "./page";
import SelectComponent from "./SelectComponent";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function NewTransactionComponent({
  incomeCategories,
  expenseCategories,
}: {
  incomeCategories: TCategories[];
  expenseCategories: TCategories[];
}) {
  const DEFAULT_ACTIVE_TAB = "expense";
  const [activeTab, setActiveTab] =
    useState<TTransactionType>(DEFAULT_ACTIVE_TAB);

  return (
    <>
      <Tabs
        defaultValue={DEFAULT_ACTIVE_TAB}
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TTransactionType)}
      >
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
    <TabsTrigger
      value={type}
      className={cn(
        "h-8 w-12 rounded-full text-base",
        type === "income"
          ? "data-[state=active]:bg-success data-[state=active]:text-success-foreground"
          : "data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground",
      )}
    >
      <Icon />
    </TabsTrigger>
  );
}
