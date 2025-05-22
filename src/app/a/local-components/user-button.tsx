"use client"

import { UserButton as ClerkUserButton } from "@clerk/nextjs"
import { Authenticated, AuthLoading } from "convex/react"

import { Skeleton } from "@/components/loading/skeleton"

export default function UserButton() {
  return (
    <div className="px-6 pt-4">
      <nav className="mx-auto w-full max-w-2xl">
        <Authenticated>
          <ClerkUserButton />
        </Authenticated>
        <AuthLoading>
          <Skeleton className="size-7 rounded-full" />
        </AuthLoading>
      </nav>
    </div>
  )
}
