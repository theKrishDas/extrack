"use client";
import { testStartingBalance } from "@/actions/startingBalanceTest";
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
import { useForm } from "react-hook-form";

type FormSchema = {
  amount: number;
};

export default function TestInitialBalanceSettings() {
  const form = useForm<FormSchema>({
    defaultValues: {
      amount: 0,
    },
  });

  async function onSubmit(values: FormSchema) {
    await testStartingBalance(values.amount);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starting balance</FormLabel>
                <FormControl>
                  <Input placeholder="Amount" {...field} />
                </FormControl>
                <FormDescription>
                  This is your balance at the time of first using this app.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
