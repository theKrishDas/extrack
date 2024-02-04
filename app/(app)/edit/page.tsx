import { getTransactionById } from "@/actions/handle-transaction";
import TransactionForm from "@/components/form/EditTransactionForm";
import { notFound, redirect } from "next/navigation";

export default async function AddTransactionPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const editId = searchParams.id;

  if (!editId) redirect("/new");

  const { transaction, error } = await getTransactionById(editId);

  // TODO: Handle this error Properly
  if (error) return <p>{error}</p>;

  if (!transaction) return notFound();

  return (
    <>
      <h1>Add New transaction</h1>
      <TransactionForm initialTransactionData={transaction} />
    </>
  );
}
