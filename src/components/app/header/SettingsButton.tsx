"use client"

import { Avatar } from "@base-ui/react/avatar"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getInitials } from "@/components/user/helpers"

export function SettingsButton() {
  const [isMounted, setIsMounted] = useState(false)
  const { user, isSignedIn, isLoaded } = useUser()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!(isMounted && isLoaded && isSignedIn && user)) return null

  return (
    <Link className="no-drag **:no-drag size-8" href="/settings">
      <Avatar.Root
        aria-hidden="true"
        className="inline-flex size-8 items-center justify-center overflow-hidden rounded-full bg-background-primary-elevated align-middle font-normal text-label-secondary text-sm leading-none"
      >
        <Avatar.Image
          className="size-full object-cover"
          height="32"
          src={user.imageUrl}
          width="32"
        />
        <Avatar.Fallback
          className="flex size-full items-center justify-center text-sm"
          delay={600}
        >
          {getInitials(user.fullName)}
        </Avatar.Fallback>
      </Avatar.Root>

      <span className="sr-only">Settings</span>
    </Link>
  )
}
