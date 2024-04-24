"use client";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { IoAddSharp } from "react-icons/io5";
import CreateNewCatDialog from "./CreateNewCatDialog";

const expenseCategories = [
  { id: "lqIGQTiN", name: "grocery", is_expense: true },
  { id: "UH3DAtex", name: "food", is_expense: true },
  { id: "B7iLVbhN", name: "clothings", is_expense: true },
];

export default function SelectCategory() {
  const categories = expenseCategories;
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Select>
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
            <SelectItem value={cat.id} key={cat.id} className="capitalize">
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
