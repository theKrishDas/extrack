import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateNewCatDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (_: boolean) => void; // eslint-disable-line no-unused-vars
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={true}>
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
