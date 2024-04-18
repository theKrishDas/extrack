import AppHeader from "@/components/app/AppHeader";
import BalanceDisplay from "@/components/app/BalanceDisplay";
import TransactionDisplay from "@/components/transactions/TransactionDisplay";

export default function Home() {
  return (
    <>
      <AppHeader />
      <BalanceDisplay />
      <TransactionDisplay hasAllTransactions={false} />
    </>
  );
}
