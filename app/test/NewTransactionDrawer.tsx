import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { TCategories } from "./page";
import { IoAddSharp } from "react-icons/io5";
import NewTransactionTab from "./NewTransactionTab";

const incomeCategories: TCategories[] = [
  { id: "i5y8zFO3", name: "salary", is_expense: true },
  { id: "zPu34l3J", name: "freelance", is_expense: true },
];
const expenseCategories: TCategories[] = [
  { id: "lqIGQTiN", name: "grocery", is_expense: true },
  { id: "UH3DAtex", name: "food", is_expense: true },
  { id: "B7iLVbhN", name: "clothings", is_expense: true },
];

export default function NewTransactionDrawer() {
  return (
    <>
      <Drawer>
        <Button className="h-12 w-12 rounded-full text-3xl" size="icon" asChild>
          <DrawerTrigger>
            <IoAddSharp />
          </DrawerTrigger>
        </Button>

        <DrawerContent className="rounded-t-3xl border-none p-5 outline-none">
          <DrawerHeader className="pb-7 pt-5">
            <DrawerTitle>New Transaction</DrawerTitle>
          </DrawerHeader>

          <NewTransactionTab
            incomeCategories={incomeCategories}
            expenseCategories={expenseCategories}
          />
        </DrawerContent>
      </Drawer>
    </>
  );
}
