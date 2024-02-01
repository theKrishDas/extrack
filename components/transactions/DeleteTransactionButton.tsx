"use client";
import { deleteTransaction } from "@/actions/handle-transaction";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

import { IoTrashBinOutline } from "react-icons/io5";

export default function DeleteTransactionButton({
  transactionId,
}: {
  transactionId: string;
}) {
  const router = useRouter();

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={async () => {
        const { error } = await deleteTransaction(transactionId);

        // TODO: Handle error and success
        if (error) {
          console.error(error);
          return;
        }

        router.push("/");
      }}
    >
      <IoTrashBinOutline />
    </Button>
  );
}
