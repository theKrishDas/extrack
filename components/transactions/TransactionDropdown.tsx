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
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
import DeleteTransactionDialog from "./DeleteTransactionDialog";
import Link from "next/link";

export default function TransactionDropdown({
  transaction,
}: {
  transaction: transactionSchemaType;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        {/* //* --------- Trigger --------- */}
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="aspect-square h-full min-h-0 min-w-0 rounded-full p-0 text-sm"
          >
            <span className="sr-only">Transaction options</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/edit-v2/${transaction.id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Add as preset</DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* //* --------- Delete --------- */}
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-destructive transition-colors data-[highlighted]:bg-destructive data-[highlighted]:text-destructive-foreground"
          >
            <div className="flex w-32 items-center justify-between">
              Delete
              <IoTrashBinOutline />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/*
        //? Render the dialog outside this component
      */}
      <DeleteTransactionDialog
        transactionId={transaction.id}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
      />
    </>
  );
}
