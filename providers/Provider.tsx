"use client";
import FullscreenSpinner from "@/components/loading/FullscreenSpinner";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<FullscreenSpinner />}>
        <ClerkProvider>{children}</ClerkProvider>
      </Suspense>
    </>
  );
}
