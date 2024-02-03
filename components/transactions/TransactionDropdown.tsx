"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoEllipsisVertical } from "react-icons/io5";
import TransactionDeleteAction from "./actions/TransactionDeleteAction";

export default function TransactionDropdown({
  transaction,
}: {
  transaction: transactionSchemaType;
}) {
  return (
    <DropdownMenu>
      {/* //* --------- Trigger --------- */}
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="aspect-square h-full min-h-0 min-w-0 rounded-full p-0 text-lg"
        >
          <IoEllipsisVertical />
        </Button>
      </DropdownMenuTrigger>

      {/* //* --------- Content --------- */}
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Add as preset</DropdownMenuItem>
        <DropdownMenuSeparator />
        <TransactionDeleteAction transactionId={transaction.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
