"use client"

import { UserButton as ClerkUserButton } from "@clerk/nextjs"
import { Authenticated, AuthLoading } from "convex/react"

import { Skeleton } from "@/components/loading/skeleton"

export default function UserButton() {
  return (
    <nav className="px-6 pt-4">
      <Authenticated>
        <ClerkUserButton />
      </Authenticated>
      <AuthLoading>
        <Skeleton className="size-7 rounded-full" />
      </AuthLoading>
    </nav>
  )
}
