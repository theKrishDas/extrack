import { ContentWrapper } from "@/components/contentwrapper";
import { Main } from "@/components/mainwrapper";
import PageTitleWithNavigation from "@/components/navigation/PageTitleWithNavigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function StartingBalanceSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Main>
      <PageTitleWithNavigation href="/settings" heading="Balance" />

      <Suspense fallback={<StartingBalanceSettingsPageSkeleton />}>
        <ContentWrapper>{children}</ContentWrapper>
      </Suspense>
    </Main>
  );
}

function StartingBalanceSettingsPageSkeleton() {
  return <Skeleton className="h-40 w-full rounded-3xl" />;
}
