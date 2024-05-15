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
    <Main className="space-y-0">
      <PageTitleWithNavigation href="/settings" heading="Category" />

      {/* NOTE: spacing between heading and body */}
      <div className="block h-5 w-full" />

      <Suspense fallback={<Loading />}>{children}</Suspense>
    </Main>
  );
}

function Loading() {
  return <Skeleton className="h-40 w-full rounded-3xl" />;
}
