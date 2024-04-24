"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IoAddSharp } from "react-icons/io5";
import CreateNewCatDialog from "./CreateNewCatDialog";
import { toNormalCase } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import {
  NewTransactionFormSchemaType,
  TCategories,
} from "@/lib/types/new-transaction-form-schema";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectCategory({
  form,
  categories,
}: {
  form: UseFormReturn<NewTransactionFormSchemaType, any, undefined>;
  categories: TCategories[];
}) {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem className="space-y-0">
            <FormLabel className="hidden">
              Select category for this transaction
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <Button
                  className="h-10 w-fit gap-2 rounded-full px-5 shadow-none"
                  variant="secondary"
                  type="button"
                  asChild
                >
                  <SelectTrigger className="flex-row-reverse border-none outline-none">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                </Button>
              </FormControl>

              <SelectContent>
                <Button
                  variant="ghost"
                  className="flex h-10 w-full justify-between px-2 font-semibold"
                  onClick={() => {
                    setDialogOpen(true);
                  }}
                >
                  Create new
                  <IoAddSharp size={18} />
                </Button>
                <CreateNewCatDialog
                  open={isDialogOpen}
                  onOpenChange={setDialogOpen}
                />

                <hr className="mt-1 py-1" />

                {/* --- Select items --- */}
                {categories.map((cat) => (
                  <SelectItem value={cat.id} key={cat.id}>
                    {toNormalCase(cat.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormDescription className="hidden">
              This will help categorize your expenses and provide detailed
              information about your spending habits. It is recommended to
              select a category for each expense to get the most out of your
              tracking!
            </FormDescription>
          </FormItem>
        )}
      />
    </>
  );
}
