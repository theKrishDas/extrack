import BackNavigation from "@/components/navigation/AppNavigateBack";
import TransactionDisplay from "@/components/transactions/TransactionDisplay";

export default function AllTransactionsPage() {
  return (
    <>
      <BackNavigation heading="All transactions" />
      <TransactionDisplay hasAllTransactions={true} />
    </>
  );
}
