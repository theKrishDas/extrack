import AppHeader from "@/components/app/AppHeader";
import BalanceDisplay from "@/components/app/BalanceDisplay";
import { Main } from "@/components/mainwrapper";
import TransactionDisplay from "@/components/transactions/TransactionDisplay";

export default function Home() {
  return (
    <Main>
      <AppHeader />
      <BalanceDisplay />
      <TransactionDisplay hasAllTransactions={false} />
    </Main>
  );
}
