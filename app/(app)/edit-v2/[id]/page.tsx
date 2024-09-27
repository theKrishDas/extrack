import { getTransactionById } from "@/actions/handle-transaction";
import TransactionForm from "@/components/form/EditTransactionForm";
import AppNavigateBack from "@/components/navigation/AppNavigateBack";
import { IoCloseSharp } from "react-icons/io5";
import { notFound } from "next/navigation";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function EditTransactionPage({
  params: { id: _id },
}: {
    params: { id: string };
  }) {

  const { transaction, error } = await getTransactionById(_id);

  // TODO: Handle this error Properly
  if (error || !transaction) return notFound();

  return <>
    <AppNavigateBack heading="Edit" icon={<IoCloseSharp />} />
    <TransactionForm initialTransactionData={transaction} />
  </>
}
