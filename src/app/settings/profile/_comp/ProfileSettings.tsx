"use client"

import { useClerk, useUser } from "@clerk/nextjs"
import Image from "next/image"
import { useState } from "react"
import { Button as RacButton } from "react-aria-components"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { InsetList } from "@/components/ui/inset-list"

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

  if (!isLoaded) {
    return (
      <div className="px-4 py-10 text-center text-label-tertiary text-sm">
        Loading profile…
      </div>
    )
  }

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
      toast.error("Could not copy Clerk user ID")
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
        className="relative overflow-hidden rounded-[2rem] bg-background-primary-elevated px-6 pt-7 pb-6 shadow-[0_12px_40px_color-mix(in_oklab,var(--foreground)_8%,transparent)]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,oklch(from_var(--ios-blue)_l_c_h_/_0.2),transparent_68%)]" />
        <div className="pointer-events-none absolute -top-10 right-0 size-28 rounded-full bg-[color-mix(in_oklab,var(--ios-cyan)_22%,transparent)] blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <div className="relative mb-4 overflow-hidden rounded-[2rem] ring-1 ring-black/5">
            {user.imageUrl ? (
              <Image
                alt={`${displayName} profile photo`}
                className="size-[104px] object-cover"
                height={PROFILE_IMAGE_SIZE}
                loader={({ src }) => src}
                src={user.imageUrl}
                unoptimized
                width={PROFILE_IMAGE_SIZE}
              />
            ) : (
              <div className="inline-grid size-[104px] place-content-center bg-[color-mix(in_oklab,var(--ios-blue)_16%,var(--fill-tertiary))] font-semibold text-3xl text-label-primary">
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

      <InsetList.Root>
        <InsetList.Section asChild>
          <section>
            <InsetList.SectionHeader>
              <InsetList.SectionTitle>Profile</InsetList.SectionTitle>
              <InsetList.SectionDescription>
                Clerk is the source of truth for this signed-in user.
              </InsetList.SectionDescription>
            </InsetList.SectionHeader>

            <ul className="InsetListSectionItems">
              <InsetList.Item>
                <InsetList.ItemLeading>
                  <InsetList.ItemMedia
                    className="bg-[color-mix(in_oklab,var(--ios-blue)_18%,transparent)] text-ios-blue"
                    variant="rounded"
                  >
                    􀉩
                  </InsetList.ItemMedia>
                </InsetList.ItemLeading>

                <InsetList.ItemBody>
                  <InsetList.ItemTitle>Name</InsetList.ItemTitle>
                  <InsetList.ItemSubtitle>{displayName}</InsetList.ItemSubtitle>
                </InsetList.ItemBody>
              </InsetList.Item>

              <InsetList.Item>
                <InsetList.ItemLeading>
                  <InsetList.ItemMedia
                    className="bg-[color-mix(in_oklab,var(--ios-cyan)_18%,transparent)] text-ios-cyan"
                    variant="rounded"
                  >
                    􀍕
                  </InsetList.ItemMedia>
                </InsetList.ItemLeading>

                <InsetList.ItemBody>
                  <InsetList.ItemTitle>Email</InsetList.ItemTitle>
                  <InsetList.ItemSubtitle className="break-all">
                    {email}
                  </InsetList.ItemSubtitle>
                </InsetList.ItemBody>
              </InsetList.Item>
            </ul>
          </section>
        </InsetList.Section>

        <InsetList.Section asChild>
          <section>
            <InsetList.SectionHeader>
              <InsetList.SectionTitle>Developer</InsetList.SectionTitle>
            </InsetList.SectionHeader>

            <ul className="InsetListSectionItems">
              <InsetList.Item align="start">
                <InsetList.ItemLeading>
                  <InsetList.ItemMedia
                    className="bg-[color-mix(in_oklab,var(--ios-indigo)_18%,transparent)] text-ios-indigo"
                    variant="rounded"
                  >
                    􀤆
                  </InsetList.ItemMedia>
                </InsetList.ItemLeading>

                <InsetList.ItemBody>
                  <InsetList.ItemTitle>Clerk User ID</InsetList.ItemTitle>
                  <InsetList.ItemSubtitle className="break-all font-mono text-[0.92rem]">
                    {user.id}
                  </InsetList.ItemSubtitle>
                </InsetList.ItemBody>

                <InsetList.ItemTrailing className="flex min-h-13 items-center">
                  <RacButton
                    className="rounded-full bg-fill-secondary px-3 py-1 font-medium text-ios-blue text-sm outline-none transition-colors data-pressed:bg-fill-primary"
                    onPress={copyUserId}
                  >
                    Copy
                  </RacButton>
                </InsetList.ItemTrailing>
              </InsetList.Item>
            </ul>
          </section>
        </InsetList.Section>
      </InsetList.Root>

      <div className="px-1">
        <Button
          className="h-14 w-full rounded-[1.75rem] text-base"
          color="red"
          isDisabled={isSigningOut}
          onPress={handleSignOut}
          variant="tinted"
        >
          {isSigningOut ? "Signing Out…" : "Sign Out"}
        </Button>
      </div>
    </div>
  )
}
