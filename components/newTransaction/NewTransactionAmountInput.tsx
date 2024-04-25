import { NewTransactionFormSchemaType } from "@/lib/types/new-transaction-form-schema";
import { cn } from "@/lib/utils";
import CurrencyInput from "react-currency-input-field";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

export default function NewTransactionAmountInput({
  form,
  isExpense,
}: {
  form: UseFormReturn<NewTransactionFormSchemaType, any, undefined>;
  isExpense: boolean;
}) {
  return (
    <>
      <FormField
        control={form.control}
        name="amount"
        render={() => (
          <FormItem className="space-y-0">
            <FormLabel className="hidden">
              Add amount for this transaction
            </FormLabel>
            <FormControl>
              <CurrencyInput
                decimalsLimit={2}
                allowNegativeValue={false}
                maxLength={8}
                placeholder="Amount"
                className={cn(
                  "w-full truncate border-none bg-transparent text-5xl font-light tracking-tight outline-none",
                  isExpense ? "text-destructive" : "text-success",
                )}
                onValueChange={(_, __, values) =>
                  form.setValue("amount", values?.float ?? 0)
                }
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}
