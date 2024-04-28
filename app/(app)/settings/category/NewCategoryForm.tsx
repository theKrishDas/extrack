"use client";
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
import { DrawerClose } from "@/components/ui/drawer";

import { useForm } from "react-hook-form";

// TODO: Move this to library
type TNewCategoryType = {
  name: string;
};

export default function NewCategoryForm() {
  const form = useForm<TNewCategoryType>({ defaultValues: { name: "" } });

  const onSubmit = (data: TNewCategoryType) => {
    console.log(data.name);
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
                    className="h-16 w-full flex-1 bg-transparent text-4xl outline-none"
                    {...field}
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
