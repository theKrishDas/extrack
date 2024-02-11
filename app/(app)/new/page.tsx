import NewTransactionForm from "@/components/form/NewTransactionForm";
import AppNavigateBack from "@/components/navigation/AppNavigateBack";
import { IoCloseSharp } from "react-icons/io5";

export default function NewTransactionPage() {
  return (
    <>
      <AppNavigateBack heading="Add new" icon={<IoCloseSharp />} />

      <NewTransactionForm />
    </>
  );
}
