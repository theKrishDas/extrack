import { ContentWrapper } from "@/components/contentwrapper";
import { Main } from "@/components/mainwrapper";
import PageTitleWithNavigation from "@/components/navigation/PageTitleWithNavigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function CategorySettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Main>
      <PageTitleWithNavigation href="/settings" heading="Category" />

      <Suspense fallback={<Loading />}>
        <ContentWrapper className="pt-3">{children}</ContentWrapper>
      </Suspense>
    </Main>
  );
}

function Loading() {
  return <Skeleton className="h-40 w-full rounded-3xl" />;
}
