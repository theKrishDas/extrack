"use client"

import { useClerk, useUser } from "@clerk/nextjs"
import { useState } from "react"
import { toast } from "sonner"
import { Spinner } from "@/components/loading/spinner"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/components/user/helpers"
import { ProfileDetail } from "./ProfileDetail"
import { ProfileHeader } from "./ProfileHeader"

const getDisplayName = (fullName: string | null | undefined, email: string) => {
  if (fullName && fullName.trim().length > 0) {
    return fullName
  }

  const [localPart] = email.split("@")

  return localPart || "Profile"
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
      <ProfileHeader
        displayName={displayName}
        email={email}
        imageUrl={user.imageUrl}
        initials={initials}
      />

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
