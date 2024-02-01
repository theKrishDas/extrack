import { getTransactionById } from "@/actions/handle-transaction";
import DeleteTransactionButton from "@/components/transactions/DeleteTransactionButton";
import TransactionDetail from "@/components/transactions/TransactionDetail";
import { notFound } from "next/navigation";

export default async function TransactionDetailPage({
  params: { id: _id },
}: {
  params: { id: string };
}) {
  const { transaction, error } = await getTransactionById(_id);

  // TODO: Handle this error Properly
  /**
   * Check for error, undefined transaction, or empty transaction array.
   * If any of these conditions is true, return a "not found" response.
   * - `error` evaluates truthy when an error has occurred (ex: `.../transaction/invalid-uuid-format`).
   * - `!transaction` is true when the transaction is undefined.
   * - `transaction.length === 0` is true when the transaction array is empty.
   */
  if (error || !transaction || transaction.length === 0) return notFound();

  return (
    <>
      <TransactionDetail transaction={transaction[0]} />
      <DeleteTransactionButton transactionId={_id} />
    </>
  );
}
