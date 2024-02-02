"use client";
import { deleteTransaction } from "@/actions/handle-transaction";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Spinner from "@/components/spinner";
import { IoTrashBinOutline } from "react-icons/io5";

export default function DeleteTransactionButton({
  transactionId,
}: {
  transactionId: string;
}) {
  const router = useRouter();
  const [isDeletingTransaction, setDeletingTransaction] = useState(false);

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={async () => {
        setDeletingTransaction(true);

        const { error } = await deleteTransaction(transactionId);

        setDeletingTransaction(false);

        // TODO: Handle error and success
        if (error) {
          console.error(error);
          return;
        }

        router.push("/");
      }}
    >
      {isDeletingTransaction ? <Spinner size={14} /> : <IoTrashBinOutline />}
    </Button>
  );
}
