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

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
        <ul className="flex h-full w-full flex-col gap-2 rounded-3xl bg-card p-4">
          {categories.map((cat) => (
            <li key={cat.id} className="flex items-center justify-between ">
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

      <Drawer>
        <DrawerTrigger asChild>
          <Button className="absolute right-0 top-0 h-10 gap-2 rounded-full">
            Add new <span className="sr-only">category</span>
            <IoAddSharp />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
            <div className="h-44 w-full"></div>
          </DrawerHeader>
          <DrawerFooter>
            {/* <Button>Submit</Button> */}
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
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
