import AppHeader from "@/components/app/AppHeader";
import TotalBalance from "@/components/app/TotalBalance";
import TransactionDisplay from "@/components/transactions/TransactionDisplay";

export default function Home() {
  return (
    <>
      <AppHeader />
      <TotalBalance />
      <TransactionDisplay hasAllTransactions={false} />
    </>
  );
}
