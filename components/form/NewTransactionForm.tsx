"use client";
import Spinner from "@/components/spinner";
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
import {
  NewTransactionSchema,
  type NewTransactionSchemaType,
} from "@/lib/form-schema/new-transaction-schema";
import { wait } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";

export default function NewTransactionForm() {
  const MAX_AMOUNT_LIMIT = 1_00_00_000;
  const DEFAULT_TRANSACTION_IS_EXPENSE = true;

  const [isExpense, setIsExpense] = useState(DEFAULT_TRANSACTION_IS_EXPENSE);
  const transactionTypeText = isExpense ? "Expense" : "Income";

  const form = useForm<NewTransactionSchemaType>({
    resolver: zodResolver(NewTransactionSchema),
    defaultValues: {
      label: "",
      is_expense: DEFAULT_TRANSACTION_IS_EXPENSE,
    },
  });

  async function onFormSubmit(data: NewTransactionSchemaType) {
    await wait(1300);
    console.log(data);
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
