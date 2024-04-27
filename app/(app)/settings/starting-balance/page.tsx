import PageTitleWithNavigation from "@/components/navigation/PageTitleWithNavigation";
import StartingBalanceSettingsWrapper from "./StartingBalanceSettingsWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function StartingBalanceSettingsPage() {
  return (
    <>
      <PageTitleWithNavigation heading="Balance" href="/settings" />

      <Suspense fallback={<StartingBalanceSettingsPageSkeleton />}>
        <StartingBalanceSettingsWrapper />
      </Suspense>
    </>
  );
}

function StartingBalanceSettingsPageSkeleton() {
  return <Skeleton className="h-40 w-full rounded-3xl" />;
}
