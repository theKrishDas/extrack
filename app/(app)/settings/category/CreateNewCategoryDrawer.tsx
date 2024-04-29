"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import NewCategoryForm from "./NewCategoryForm";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IoAddSharp } from "react-icons/io5";
import { TTransactionType } from "@/lib/types/new-transaction-form-schema";
import { useState } from "react";

export default function CreateNewCategoryDrawer({
  type,
}: {
  type: TTransactionType;
}) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button
          className="absolute right-0 top-0 h-10 gap-2 rounded-full"
          onClick={() => setDrawerOpen(true)}
        >
          Add new <span className="sr-only">category</span>
          <IoAddSharp />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="rounded-t-3xl p-7">
        <DrawerHeader className="p-0 py-7 text-left">
          <DrawerTitle>
            New category for{" "}
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-px text-base font-normal",
                type === "income" ? "bg-success/10 " : "bg-destructive/10 ",
              )}
            >
              <span
                className={cn(
                  "inline-block h-2 w-2 rounded-full bg-success",
                  type === "income" ? "bg-success" : "bg-destructive",
                )}
              />
              {type}
            </span>
          </DrawerTitle>
        </DrawerHeader>

        <NewCategoryForm setDrawerOpen={setDrawerOpen} />
      </DrawerContent>
    </Drawer>
  );
}
