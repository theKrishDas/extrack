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
import { TTransactionType } from "@/lib/types/new-transaction-form-schema";

import { useForm } from "react-hook-form";

// TODO: Move this to library
type TNewCategoryType = {
  name: string;
};

export default function NewCategoryForm({
  setDrawerOpen,
  type,
}: {
  setDrawerOpen: (_: boolean) => void; // eslint-disable-line no-unused-vars
  type: TTransactionType;
}) {
  const form = useForm<TNewCategoryType>({ defaultValues: { name: "" } });

  const onSubmit = async (data: TNewCategoryType) => {
    const isExpense = type !== "income";

    const createCategory = await import("@/actions/handle-category").then(
      (_) => _.createCategory,
    );

    await createCategory(data.name, isExpense);

    setDrawerOpen(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-0 pb-7">
                <FormLabel className="sr-only">Category Name</FormLabel>
                <FormControl>
                  <input
                    placeholder="Category name"
                    className="h-16 w-full flex-1 bg-transparent text-4xl font-light tracking-tight outline-none"
                    value={field.value}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value
                        .toLowerCase()
                        .trim(); // No spaces in category name

                      form.setValue("name", sanitizedValue);
                    }}
                  />
                </FormControl>
                <FormDescription className="sr-only">
                  This will be used for insights.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="h-12 w-full rounded-full text-base">
            Create
          </Button>
        </form>
      </Form>
    </>
  );
}
