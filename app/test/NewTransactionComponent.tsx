"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IoAddSharp, IoRemoveSharp } from "react-icons/io5";
import { TCategories, TTransactionType } from "./page";
import { useState } from "react";
import { cn } from "@/lib/utils";
import NewTransactionForm from "./NewTransactionForm";

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

        <NewTransactionForm type="income" categories={incomeCategories} />
        <NewTransactionForm type="expense" categories={expenseCategories} />
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
        "h-9 w-12 rounded-full text-base",
        type === "income"
          ? "data-[state=active]:bg-success data-[state=active]:text-success-foreground"
          : "data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground",
      )}
    >
      <Icon />
    </TabsTrigger>
  );
}
