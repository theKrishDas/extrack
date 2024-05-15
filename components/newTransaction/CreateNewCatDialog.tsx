import {
  ActionDialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  DialogAction,
} from "@/components/ui/ActionDialog";

export default function CreateNewCatDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (_: boolean) => void; // eslint-disable-line no-unused-vars
}) {
  return (
    <>
      <ActionDialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create category</DialogTitle>
            <DialogDescription>
              Create a new category for organization.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            <CategoryForm />
          </DialogBody>

          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <DialogAction className="text-info">Create</DialogAction>
          </DialogFooter>
        </DialogContent>
      </ActionDialog>
    </>
  );
}

function CategoryForm() {
  return <div className="flex flex-col gap-2"></div>;
}
