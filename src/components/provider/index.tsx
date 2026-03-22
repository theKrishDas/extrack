"use client"

import { ClerkProvider, useAuth } from "@clerk/nextjs"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { RouterProvider } from "react-aria-components"

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >
  }
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "", {
  expectAuth: true,
})

export default function Provider({ children }: { children: ReactNode }) {
  const router = useRouter()

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ClerkProvider>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <ConvexQueryCacheProvider>
            <RouterProvider navigate={router.push}>{children}</RouterProvider>
          </ConvexQueryCacheProvider>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ThemeProvider>
  )
}
