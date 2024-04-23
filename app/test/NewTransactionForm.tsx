"use client";

import { cn } from "@/lib/utils";
import { IoArrowUpSharp, IoCalendarClearOutline } from "react-icons/io5";
import SelectComponent from "./SelectComponent";
import { TCategories, TTransactionType } from "./page";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LuUndo2 } from "react-icons/lu";
import CurrencyInput from "react-currency-input-field";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { NewTransactionSchemaType } from "@/lib/form-schema/new-transaction-schema";

type TFormData = {
  label: string;
  amount: number;
};

export default function NewTransactionForm({
  type,
  categories,
}: {
  type: TTransactionType;
  categories: TCategories[];
}) {
  const router = useRouter();
  const form = useForm<TFormData>({ defaultValues: { label: "" } });

  async function onSubmit(data: TFormData) {
    const actualData: NewTransactionSchemaType = {
      label: data.label.trim(),
      amount: data.amount,
      is_expense: type !== "income",
    };

    const insertTransactions = await import(
      "@/actions/handle-transaction"
    ).then((_) => _.insertTransactions);

    const { error } = await insertTransactions(actualData);

    // TODO: Render alert
    if (error) {
      console.error(error);
      return;
    }

    router.push("/");
  }

  return (
    <TabsContent value={type}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="h-full w-full space-y-2 pt-3"
        >
          <div className="inline-flex w-full items-center justify-between">
            <div className="flex items-center space-x-1">
              <SelectComponent categories={categories} />

              <Button
                className="h-10 w-10 rounded-lg bg-card text-base shadow-none"
                variant="secondary"
                size="icon"
              >
                <IoCalendarClearOutline />
              </Button>
            </div>

            <Button
              className="h-10 w-10 rounded-lg text-base shadow-none"
              variant="ghost"
              size="icon"
            >
              <LuUndo2 strokeWidth={1.75} />
            </Button>
          </div>

          {/* --- --- INPUTS --- --- */}
          <section className="flex w-full flex-col items-start justify-center gap-8 rounded-3xl bg-card p-10">
            <div className="justify-betweens inline-flex w-full items-center">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <>
                    <FormItem className="inline-flex w-full items-center">
                      <FormLabel className="hidden">Label</FormLabel>
                      <FormControl>
                        <input
                          className="min-w-0 flex-1 bg-transparent text-lg outline-none"
                          placeholder="Add a Label"
                          value={field.value}
                          onChange={(e) => {
                            const sanitizedValue = e.target.value
                              .replace(/^\s+/, "") // Remove trailing white space from the start
                              .replace(/ {2,}/g, " "); // Replace consecutive spaces with a single space ;

                            form.setValue("label", sanitizedValue);
                          }}
                        />
                      </FormControl>
                      <FormDescription className="hidden">
                        This is used to name your transaction for better
                        organization.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />

              <IoArrowUpSharp
                size={16}
                className={cn(
                  "rotate-0 text-success transition-all",
                  type === "expense" && "rotate-180 text-destructive",
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={() => (
                <FormItem>
                  <FormControl>
                    <CurrencyInput
                      decimalsLimit={2}
                      allowNegativeValue={false}
                      maxLength={8}
                      placeholder="Amount"
                      className="w-full truncate border-none bg-transparent text-5xl font-light tracking-tight outline-none"
                      onValueChange={(_, __, values) =>
                        form.setValue("amount", values?.float ?? 0)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </section>

          {/* --- --- BUTTON --- --- */}
          <div className="flex w-full py-3">
            <Button
              size="lg"
              className={cn(
                "mx-auto h-12 rounded-full text-base shadow-none",
                type === "income"
                  ? "bg-success text-success-foreground"
                  : "bg-destructive text-destructive-foreground",
              )}
              type="submit"
              disabled={
                form.watch("amount") === undefined || form.watch("amount") === 0
              }
            >
              Add
            </Button>
          </div>
        </form>
      </Form>
    </TabsContent>
  );
}
