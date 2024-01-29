export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="container">{children}</main>
    </>
  );
}
