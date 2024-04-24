import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const expenseCategories = [
  { id: "lqIGQTiN", name: "grocery", is_expense: true },
  { id: "UH3DAtex", name: "food", is_expense: true },
  { id: "B7iLVbhN", name: "clothings", is_expense: true },
];

export default function SelectCategory() {
  return (
    <>
      <Select>
        <Button
          className="h-10 gap-2 rounded-full px-5 shadow-none"
          variant="secondary"
          type="button"
          asChild
        >
          <SelectTrigger className="flex-row-reverse border-none outline-none">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
        </Button>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
