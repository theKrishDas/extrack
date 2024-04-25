import { Suspense } from "react";
import PageTitleWithNavigation from "@/components/navigation/PageTitleWithNavigation";
import NewTransactionTab from "./NewTransactionTab";
import NewTransactionFallback from "./NewTransactionFallback";

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
