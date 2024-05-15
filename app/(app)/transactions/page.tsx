import { ContentWrapper } from "@/components/contentwrapper";
import { Main } from "@/components/mainwrapper";
import BackNavigation from "@/components/navigation/AppNavigateBack";
import TransactionDisplay from "@/components/transactions/TransactionDisplay";

export default function AllTransactionsPage() {
  return (
    <Main>
      <ContentWrapper>
        <BackNavigation heading="All transactions" />
        <TransactionDisplay hasAllTransactions={true} />
      </ContentWrapper>
    </Main>
  );
}
