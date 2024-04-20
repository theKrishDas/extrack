"use client";

import { IoAddSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateNewCatDialog from "./CreateNewCatDialog";
import { TCategories } from "./page";
import { useState } from "react";

export default function SelectComponent({
  categories,
}: {
  categories: TCategories[];
}) {
  const [isSelectOpen, setSelectOpen] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <Select open={isSelectOpen} onOpenChange={setSelectOpen}>
      <SelectTrigger className="">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {/* --- Create new button --- */}
        <Button
          variant="ghost"
          className="flex h-10 w-full justify-between px-2 font-semibold"
          onClick={() => {
            setSelectOpen(false);
            setDialogOpen(true);
          }}
        >
          Create new
          <IoAddSharp size={18} />
        </Button>
        <CreateNewCatDialog open={isDialogOpen} onOpenChange={setDialogOpen} />

        <hr className="mt-1 py-1" />

        {/* --- Select items --- */}
        {categories.map((cat) => (
          <SelectItem value={cat.id} key={cat.id} className="capitalize">
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
