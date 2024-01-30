"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* //TODO: Add custom fallback component */}
      <Suspense fallback={"Loading..."}>
        <ClerkProvider>{children}</ClerkProvider>
      </Suspense>
    </>
  );
}
