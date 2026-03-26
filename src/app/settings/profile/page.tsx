"use client"

import { Container } from "@/components/layout/container"
import { Header } from "@/components/ui/navigation-header/header"
import { Spacer } from "@/components/ui/spacer"
import { ProfileSettings } from "./_comp/ProfileSettings"

export default function Page() {
  return (
    <main className="flex-1 px-4" data-vaul-drawer-wrapper="">
      <Spacer className="h-4" />
      <Container as="section" className="flex flex-col gap-0.5">
        <Header href="/settings" title="Profile" />
        <Spacer className="h-8" />
        <ProfileSettings />
      </Container>
    </main>
  )
}
