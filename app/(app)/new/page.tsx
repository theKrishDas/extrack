import { Suspense } from "react";
import PageTitleWithNavigation from "@/components/navigation/PageTitleWithNavigation";
import NewTransactionFallback from "@/components/newTransaction/NewTransactionFallback";
import NewTransactionTab from "./NewTransactionTab";
import { Main } from "@/components/mainwrapper";

export default function NewTransactionPage() {
  return (
    <Main>
      <PageTitleWithNavigation heading="Add new" href="/" />

      <Suspense fallback={<NewTransactionFallback />}>
        <NewTransactionTab />
      </Suspense>
    </Main>
  );
}
