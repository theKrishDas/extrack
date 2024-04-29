"use client";
import { LuTrash } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
  ActionDialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogAction,
} from "@/components/ui/ActionDialog";
import { TCategories } from "@/lib/types/new-transaction-form-schema";

export default function CategoryDeleteButton({
  category,
}: {
  category: TCategories;
}) {
  async function onCategoryDelete() {
    console.log(category);
  }

  return (
    <ActionDialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full">
          <LuTrash />
          <span className="sr-only">Delete category</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {category.name}?</DialogTitle>
          <DialogDescription>
            Deleting categories will cause recalculation.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogAction
            className="text-destructive"
            onClick={async () => await onCategoryDelete()}
          >
            Delete
          </DialogAction>
        </DialogFooter>
      </DialogContent>
    </ActionDialog>
  );
}
