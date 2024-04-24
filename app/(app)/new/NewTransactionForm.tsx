"use client";

import { cn, wait } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PickDate } from "./PickDate";
import SelectCategory from "./SelectCategory";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  NewTransactionFormSchemaType,
  NewTransactionSchema,
  NewTransactionSchemaType,
  TCategories,
  TTransactionType,
} from "@/lib/types/new-transaction-form-schema";
import NewTransactionLabelInput from "./NewTransactionLabelInput";
import NewTransactionAmountInput from "./NewTransactionAmountInput";
import { useState } from "react";
import Spinner from "@/components/spinner";
import { MINIMUM_TRANSACTION_AMOUNT } from "@/lib/defaultValues";

export default function NewTransactionForm({
  tabType,
  categories,
}: {
  tabType: TTransactionType;
  categories: TCategories[];
}) {
  const isExpense = tabType !== "income";

  const [isFormSubmitting, setFormSubmitting] = useState(false);

  const form = useForm<NewTransactionFormSchemaType>({
    defaultValues: { label: "", date: new Date() },
  });

  async function onSubmit(data: NewTransactionFormSchemaType) {
    // TODO: Remove trailing spaces from the label

    setFormSubmitting(true);
    await wait(2500);

    const actualData: NewTransactionSchemaType = {
      amount: data.amount,
      label: data.label,
      date: data.date,
      category: data.category,
      is_expense: isExpense,
    };
    console.log(
      "Success: ",
      NewTransactionSchema.safeParse(actualData).success,
    );
    console.log(actualData);
    setFormSubmitting(false);
  }

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="inline-flex w-full items-center gap-2">
          <PickDate form={form} />

          <SelectCategory form={form} categories={categories} />
        </div>

        {/* --- --- INPUTS --- --- */}
        <section className="flex w-full flex-col items-start justify-center gap-8 rounded-3xl bg-card p-10">
          <NewTransactionLabelInput form={form} isExpense={isExpense} />

          <NewTransactionAmountInput form={form} isExpense={isExpense} />
        </section>

        <div className="flex flex-row-reverse items-center gap-2">
          <Button
            variant="secondary"
            className={cn(
              "h-14 w-full rounded-full bg-card text-base shadow-none",
              isExpense ? "text-destructive" : "text-success",
            )}
            type="submit"
            disabled={
              isFormSubmitting ||
              form.watch("amount") === undefined ||
              form.watch("amount") < MINIMUM_TRANSACTION_AMOUNT
            }
          >
            {isFormSubmitting ? <Spinner size={18} /> : "Add"}
          </Button>
          <Button
            className="h-14 w-full rounded-full text-base text-foreground/50"
            variant="ghost"
            type="button"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
