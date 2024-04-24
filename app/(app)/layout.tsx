import BottomNavigation from "@/components/navigation/BottomNavigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="container space-y-8 py-4">{children}</main>

      <BottomNavigation />
    </>
  );
}
