import PageTitleWithNavigation from "@/components/navigation/PageTitleWithNavigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function StartingBalanceSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageTitleWithNavigation href="/settings" heading="Balance" />

      <Suspense fallback={<StartingBalanceSettingsPageSkeleton />}>
        {children}
      </Suspense>
    </>
  );
}

function StartingBalanceSettingsPageSkeleton() {
  return <Skeleton className="h-40 w-full rounded-3xl" />;
}
