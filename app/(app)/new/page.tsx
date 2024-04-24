import PageTitleWithNavigation from "@/components/navigation/PageTitleWithNavigation";
import NewTransactionTab from "./NewTransactionTab";

export default function NewTransactionPage() {
  return (
    <>
      <PageTitleWithNavigation heading="Add new" href="/new" />
      <NewTransactionTab />
    </>
  );
}
