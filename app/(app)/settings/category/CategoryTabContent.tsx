import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import {
  TCategories,
  TTransactionType,
} from "@/lib/types/new-transaction-form-schema";
import { IoAddSharp } from "react-icons/io5";
import { LuTrash } from "react-icons/lu";

import {
  ActionDialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  DialogAction,
} from "@/components/ui/ActionDialog";
import CreateNewCategoryDrawer from "./CreateNewCategoryDrawer";
import { cn } from "@/lib/utils";

export default function CategoryTabContent({
  type,
  categories,
}: {
  type: TTransactionType;
  categories: TCategories[];
}) {
  return (
    <TabsContent value={type}>
      {categories.length <= 0 ? (
        <NoCategoryMessege />
      ) : (
        <ul className="flex w-full flex-col rounded-2xl bg-card">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex h-14 items-center justify-between px-4"
            >
              <p className="capitalize">{cat.name}</p>

              <ActionDialog>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 rounded-full"
                  >
                    <LuTrash />
                    <span className="sr-only">Delete category</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete {cat.name}?</DialogTitle>
                    <DialogDescription>
                      Deleting categories will cause recalculation.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogBody></DialogBody>

                  <DialogFooter>
                    <DialogClose>Cancel</DialogClose>
                    <DialogAction className="text-destructive">
                      Delete
                    </DialogAction>
                  </DialogFooter>
                </DialogContent>
              </ActionDialog>
            </li>
          ))}
        </ul>
      )}
      <CreateNewCategoryDrawer type={type} />
    </TabsContent>
  );
}

function NoCategoryMessege() {
  return (
    <div className="grid h-44 w-full place-content-center gap-2 rounded-3xl p-4">
      <p className="text-sm font-semibold text-foreground/20">No categories</p>
    </div>
  );
}
