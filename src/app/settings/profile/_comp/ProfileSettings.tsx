"use client"

import { useClerk, useUser } from "@clerk/nextjs"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
import { Spinner } from "@/components/loading/spinner"
import { Button } from "@/components/ui/button"
import { ProfileDetail } from "./ProfileDetail"

const PROFILE_IMAGE_SIZE = 104
const WHITESPACE_REGEX = /\s+/

const getDisplayName = (fullName: string | null | undefined, email: string) => {
  if (fullName && fullName.trim().length > 0) {
    return fullName
  }

  const [localPart] = email.split("@")

  return localPart || "Profile"
}

const getInitials = (name: string) => {
  const [first = "", second = ""] = name.trim().split(WHITESPACE_REGEX)
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase() || "A"
}

export function ProfileSettings() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const [isSigningOut, setIsSigningOut] = useState(false)

  if (!isLoaded) return <Spinner />

  if (!(isSignedIn && user)) {
    return (
      <div className="px-4 py-10 text-center text-label-tertiary text-sm">
        No signed-in profile found.
      </div>
    )
  }

  const email = user.primaryEmailAddress?.emailAddress ?? "No email available"
  const displayName = getDisplayName(user.fullName, email)
  const initials = getInitials(displayName)

  const copyUserId = async () => {
    try {
      await navigator.clipboard.writeText(user.id)
      toast.success("Copied Clerk user ID")
    } catch {
      toast.error("Could not copy User ID")
    }
  }

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut({ redirectUrl: "/sign-in" })
    } catch {
      setIsSigningOut(false)
      toast.error("Could not sign out")
    }
  }

  return (
    <div className="flex flex-col gap-7">
      <section
        aria-label="Profile overview"
        className="relative overflow-hidden rounded-4xl bg-background-primary-elevated px-6 pt-7 pb-6 shadow-[0_12px_40px_color-mix(in_oklab,var(--foreground)_8%,transparent)]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,oklch(from_var(--ios-blue)_l_c_h/0.2),transparent_68%)]" />
        <div className="pointer-events-none absolute -top-10 right-0 size-28 rounded-full bg-[color-mix(in_oklab,var(--ios-cyan)_22%,transparent)] blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <div className="relative mb-4 overflow-hidden rounded-4xl ring-1 ring-black/5">
            {user.imageUrl ? (
              <Image
                alt={`${displayName} profile photo`}
                className="size-26 object-cover"
                height={PROFILE_IMAGE_SIZE}
                loader={({ src }) => src}
                src={user.imageUrl}
                unoptimized
                width={PROFILE_IMAGE_SIZE}
              />
            ) : (
              <div className="inline-grid size-26 place-content-center bg-[color-mix(in_oklab,var(--ios-blue)_16%,var(--fill-tertiary))] font-semibold text-3xl text-label-primary">
                {initials}
              </div>
            )}
          </div>

          <h2 className="max-w-full truncate font-semibold text-3xl tracking-tight">
            {displayName}
          </h2>
          <p className="mt-1 max-w-full truncate text-base text-label-secondary">
            {email}
          </p>
        </div>
      </section>

      <ProfileDetail
        displayName={displayName}
        email={email}
        onCopyUserId={copyUserId}
        userId={user.id}
      />

      <div className="px-1">
        <Button
          className="h-14"
          color="red"
          fullWidth
          isDisabled={isSigningOut}
          onPress={handleSignOut}
          variant="gray"
        >
          {isSigningOut ? "Signing Out…" : "Sign Out"}
        </Button>
      </div>
    </div>
  )
}
