"use client"

import {ReactNode} from "react"
import {useRouter} from "next/navigation"
import {ConvexProvider, ConvexReactClient} from "convex/react"
import {RouterProvider} from "react-aria-components"

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >
  }
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export default function Provider({children}: {children: ReactNode}) {
  const router = useRouter()

  return (
    <ConvexProvider client={convex}>
      <RouterProvider navigate={router.push}>{children}</RouterProvider>
    </ConvexProvider>
  )
}
