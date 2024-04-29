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
import { deleteCategory } from "@/actions/handle-category";
import { toast } from "sonner";
import { useState } from "react";
import Spinner from "@/components/spinner";

export default function CategoryDeleteButton({
  category,
}: {
  category: TCategories;
}) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDeletingCategory, setDeletingCategory] = useState(false);

  async function onCategoryDelete() {
    setDeletingCategory(true);
    const { error } = await deleteCategory(category.id);

    if (error) {
      toast.error("Unable to delete category", {
        description: error,
      });
    }

    setDeletingCategory(false);
    setDialogOpen(false);
  }

  return (
    <ActionDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" onClick={() => setDialogOpen(true)}>
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
            {isDeletingCategory ? (
              <Spinner size={18} strokeWidth={2} />
            ) : (
              "Delete"
            )}
          </DialogAction>
        </DialogFooter>
      </DialogContent>
    </ActionDialog>
  );
}
