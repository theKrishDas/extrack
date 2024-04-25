import { Suspense } from "react";
import PageTitleWithNavigation from "@/components/navigation/PageTitleWithNavigation";
import NewTransactionFallback from "@/components/newTransaction/NewTransactionFallback";
import NewTransactionTab from "./NewTransactionTab";

export default function NewTransactionPage() {
  return (
    <>
      <PageTitleWithNavigation heading="Add new" href="/" />

      <Suspense fallback={<NewTransactionFallback />}>
        <NewTransactionTab />
      </Suspense>
    </>
  );
}
