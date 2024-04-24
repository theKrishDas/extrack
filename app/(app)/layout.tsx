import BottomNavigation from "@/components/navigation/BottomNavigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="container space-y-8 py-4">{children}</main>

      {/* NOTE: This spacing is to compensate the bottom navigation */}
      <div className="h-16 w-full" />
      <BottomNavigation />
    </>
  );
}
