import { getTransactionById } from "@/actions/handle-transaction";
import AppNavigateBack from "@/components/navigation/AppNavigateBack";
import TransactionDetail from "@/components/transactions/TransactionDetail";
import TransactionDropdown from "@/components/transactions/TransactionDropdown";
import { notFound } from "next/navigation";

export default async function TransactionDetailPage({
  params: { id: _id },
}: {
  params: { id: string };
}) {
  const { transaction, error } = await getTransactionById(_id);

  // TODO: Handle this error Properly
  if (error) return <p>{error}</p>;

  if (!transaction) return notFound();

  return (
    <>
      <AppNavigateBack heading={transaction?.label || "Details"}>
        <TransactionDropdown transaction={transaction} />
      </AppNavigateBack>

      <TransactionDetail transaction={transaction} />
    </>
  );
}
