"use client";
import Spinner from "@/components/spinner";
import { CalendarIcon } from "@radix-ui/react-icons";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { cn } from "@/lib/utils";

import {
  NewTransactionSchema,
  type NewTransactionSchemaType,
} from "@/lib/form-schema/new-transaction-schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { format } from "date-fns";
import { NumericFormat } from "react-number-format";

export default function TransactionForm({
  initialTransactionData,
}: {
  initialTransactionData: transactionSchemaType;
}) {
  const MAX_AMOUNT_LIMIT = 1_00_00_000;
  const DEFAULT_TRANSACTION_IS_EXPENSE = true;

  const [isExpense, setIsExpense] = useState(DEFAULT_TRANSACTION_IS_EXPENSE);
  const transactionTypeText = isExpense ? "Expense" : "Income";

  const router = useRouter();

  const defaultValues = {
    amount: Math.abs(initialTransactionData.amount),
    date: new Date(initialTransactionData.date),
    is_expense: initialTransactionData.isExpense,
    label: initialTransactionData.label || "",
  };

  const form = useForm<NewTransactionSchemaType>({
    resolver: zodResolver(NewTransactionSchema),
    defaultValues,
  });

  async function onFormSubmit(data: NewTransactionSchemaType) {
    // const insertTransactions = await import(
    //   "@/actions/handle-transaction"
    // ).then((_) => _.insertTransactions);
    // const res = await insertTransactions(data);
    // TODO: Render alert
    // if (res.error) console.error(res.error);
    // if (res.success) router.push("/");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onFormSubmit)}
        className="flex flex-col gap-3"
      >
        {/* //? ------------------ Toggle transaction type ------------------  */}
        <FormField
          control={form.control}
          name="is_expense"
          render={({ field: { value, onChange } }) => (
            <FormItem className="inline-flex items-center gap-2 space-y-0">
              <FormLabel htmlFor="toggle-transaction-type">Expense</FormLabel>
              <FormControl>
                <Switch
                  id="toggle-transaction-type"
                  checked={value}
                  onCheckedChange={(v) => {
                    setIsExpense(v);
                    onChange(v);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* //? ------------------ Amount Field ------------------  */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field: { ref, onChange, ...rest } }) => (
            <FormItem className="space-y-0">
              <VisuallyHidden.Root asChild>
                <FormLabel>Transaction Amount</FormLabel>
              </VisuallyHidden.Root>

              <FormControl>
                <NumericFormat
                  autoFocus
                  placeholder="amount"
                  inputMode="numeric"
                  customInput={Input}
                  getInputRef={ref}
                  decimalScale={2}
                  prefix="₹ "
                  thousandsGroupStyle="lakh"
                  thousandSeparator=","
                  decimalSeparator="."
                  isAllowed={(values) => {
                    const { floatValue } = values;

                    if (
                      floatValue !== undefined &&
                      floatValue < MAX_AMOUNT_LIMIT
                    ) {
                      onChange(floatValue);
                      return true;
                    }

                    return false;
                  }}
                  {...rest}
                />
              </FormControl>

              <VisuallyHidden.Root asChild>
                <FormDescription>
                  This is needed to calculate balance, organize transactions and
                  create Statistics.
                </FormDescription>
              </VisuallyHidden.Root>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* //? ------------------ Label Field ------------------  */}
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <VisuallyHidden.Root asChild>
                <FormLabel>Transaction Label</FormLabel>
              </VisuallyHidden.Root>

              <FormControl>
                <Input placeholder="Label" type="text" {...field} />
              </FormControl>

              <VisuallyHidden.Root asChild>
                <FormDescription>
                  This is needed to organise your transactions and detailed
                  Statistics.
                </FormDescription>
              </VisuallyHidden.Root>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* //? ------------------ Date Field ------------------  */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="secondary"
                      className={cn(
                        "h-12",
                        "w-fit",
                        "w-full justify-start text-left font-normal",
                        "font-medium text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          size="lg"
          disabled={form.formState.isSubmitting}
          className="text-sm"
        >
          {form.formState.isSubmitting ? (
            <Spinner size={15} />
          ) : (
            `Add ${transactionTypeText}`
          )}
        </Button>
      </form>
    </Form>
  );
}
