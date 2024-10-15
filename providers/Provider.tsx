"use client";
import FullscreenSpinner from "@/components/loading/FullscreenSpinner";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
  const querryClient = new QueryClient();

  return (
    <>
      <Suspense fallback={<FullscreenSpinner />}>
        <ClerkProvider>
          <QueryClientProvider client={querryClient}>
            {children}
          </QueryClientProvider>
        </ClerkProvider>
      </Suspense>
    </>
  );
}
