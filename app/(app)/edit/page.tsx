import { getTransactionById } from "@/actions/handle-transaction";
import TransactionForm from "@/components/form/EditTransactionForm";
import AppNavigateBack from "@/components/navigation/AppNavigateBack";
import { notFound, redirect } from "next/navigation";
import { IoCloseSharp } from "react-icons/io5";

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
      <AppNavigateBack heading="Edit" icon={<IoCloseSharp />} />
      <TransactionForm initialTransactionData={transaction} />
    </>
  );
}
