import AppHeader from "@/components/app/AppHeader";
import StartingBalancePrompt from "@/components/app/StartingBalancePrompt";
import TotalBalance from "@/components/app/TotalBalance";
import TransactionDisplay from "@/components/transactions/TransactionDisplay";

export default function Home() {
  return (
    <>
      <AppHeader />
      <StartingBalancePrompt />
      <TotalBalance />
      <TransactionDisplay hasAllTransactions={false} />
    </>
  );
}
