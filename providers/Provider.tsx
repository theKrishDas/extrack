import { ClerkProvider } from "@clerk/nextjs";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClerkProvider>{children}</ClerkProvider>
    </>
  );
}
