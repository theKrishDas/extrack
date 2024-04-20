import { IoAddSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateNewCatDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-10 w-full justify-between px-2 font-semibold"
        >
          Create new
          <IoAddSharp size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new category</DialogTitle>
        </DialogHeader>
        <CategoryForm />
      </DialogContent>
    </Dialog>
  );
}

function CategoryForm() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Switch id="category-type" />
        <Label htmlFor="category-type">Expense</Label>
      </div>

      <Input placeholder="name" />

      <div className="h-3 w-full" />

      <Button type="submit">Add</Button>
    </div>
  );
}
