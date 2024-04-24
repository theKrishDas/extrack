import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NewTransactionFormSchemaType } from "@/lib/types/new-transaction-form-schema";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { IoArrowUpSharp } from "react-icons/io5";

export default function NewTransactionLabelInput({
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
        name="label"
        render={({ field }) => (
          <FormItem className="inline-flex w-full items-center space-y-0">
            <FormLabel className="hidden">Label for transaction</FormLabel>
            <FormControl>
              <input
                className="min-w-0 flex-1 bg-transparent text-lg outline-none"
                placeholder="Add a Label"
                {...field}
              />
            </FormControl>
            <FormDescription className="hidden">
              Add a brief description to provide additional context or details
              about the transaction, making it easier to track and manage your
              spending.
            </FormDescription>
            <FormMessage />

            <IoArrowUpSharp
              size={16}
              className={cn(
                "rotate-0 text-success transition-all",
                isExpense && "rotate-180 text-destructive",
              )}
            />
          </FormItem>
        )}
      />
    </>
  );
}
