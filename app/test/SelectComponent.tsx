"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateNewCatDialog from "./CreateNewCatDialog";
import { TCategories } from "./page";

export default function SelectComponent({
  categories,
}: {
  categories: TCategories[];
}) {
  return (
    <Select>
      <SelectTrigger className="">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {/* --- Create new button --- */}
        <CreateNewCatDialog />

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
