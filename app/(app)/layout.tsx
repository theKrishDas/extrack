import BottomNavigation from "@/components/navigation/BottomNavigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="container space-y-8 py-4">{children}</main>

      {/* //TODO: Build spacer component */}
      <div className="inline-block h-20 w-full" />
      <BottomNavigation />
    </>
  );
}
