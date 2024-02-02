import { getTransactionById } from "@/actions/handle-transaction";
import AppNavigateBack from "@/components/navigation/AppNavigateBack";
import DeleteTransactionButton from "@/components/transactions/DeleteTransactionButton";
import TransactionDetail from "@/components/transactions/TransactionDetail";
import { notFound } from "next/navigation";

export default async function TransactionDetailPage({
  params: { id: _id },
}: {
  params: { id: string };
}) {
  const { transaction, error } = await getTransactionById(_id);

  /**
   * Check for error, undefined transaction, or empty transaction array.
   * If any of these conditions is true, return a "not found" response.
   * - `error` evaluates truthy when an error has occurred (ex: `.../transaction/invalid-uuid-format`).
   * - `!transaction` is true when the transaction is undefined.
   * - `transaction.length === 0` is true when the transaction array is empty.
   */
  // TODO: Handle this error Properly
  if (error) return <p>{error}</p>;

  if (!transaction) return notFound();

  return (
    <>
      <AppNavigateBack heading={transaction?.label || "Details"}>
        <DeleteTransactionButton transactionId={_id} />
      </AppNavigateBack>

      <TransactionDetail transaction={transaction} />
    </>
  );
}
