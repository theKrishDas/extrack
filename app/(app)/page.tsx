import AppHeader from "@/components/app/AppHeader";
import BalanceDisplay from "@/components/app/BalanceDisplay";
import { ContentWrapper } from "@/components/contentwrapper";
import { Main } from "@/components/mainwrapper";
import TransactionDisplay from "@/components/transactions/TransactionDisplay";

export default function Home() {
  return (
    <Main>
      <ContentWrapper>
        <AppHeader />
        <BalanceDisplay />
        <TransactionDisplay hasAllTransactions={false} />
      </ContentWrapper>
    </Main>
  );
}
