"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { IoTrashBinOutline } from "react-icons/io5";
import ActionItem from "./ActionItem";

export default function TransactionDeleteAction({
  transactionId,
}: {
  transactionId: string;
}) {
  async function handleDelete() {}

  return (
    <DropdownMenuItem
      onSelect={handleDelete}
      className="text-destructive transition-colors data-[highlighted]:bg-destructive data-[highlighted]:text-destructive-foreground"
    >
      <ActionItem actionName="Delete" icon={<IoTrashBinOutline />} />
    </DropdownMenuItem>
  );
}
