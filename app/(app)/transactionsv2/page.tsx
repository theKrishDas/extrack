import { ContentWrapper } from "@/components/contentwrapper";
import { Main } from "@/components/mainwrapper";
import BackNavigation from "@/components/navigation/AppNavigateBack";
import InfiniteTransactionList from "@/components/transactions/InfiniteTransactionList";

export default function IFOPage() {
  return (
    <Main>
      <ContentWrapper>
        <BackNavigation heading="All transactions" />
        <InfiniteTransactionList />
      </ContentWrapper>
    </Main>
  );
}
