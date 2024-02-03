"use client";

import { deleteTransaction } from "@/actions/handle-transaction";
import Spinner from "@/components/spinner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteTransactionDialog({
  transactionId,
  showDeleteDialog,
  setShowDeleteDialog,
}: {
  transactionId: string;
  showDeleteDialog: boolean;

  // eslint-disable-next-line no-unused-vars
  setShowDeleteDialog: (v: boolean) => void;
}) {
  const router = useRouter();
  const [isDeletingTransaction, setDeletingTransaction] = useState(false);

  return (
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete transaction</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button
            variant="destructive"
            onClick={async () => {
              setDeletingTransaction(true);

              const { error } = await deleteTransaction(transactionId);

              // TODO: Handle error and success
              if (error) {
                setDeletingTransaction(false);

                console.error(error);
                return;
              }

              router.push("/");
            }}
          >
            {isDeletingTransaction ? <Spinner size={14} /> : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
