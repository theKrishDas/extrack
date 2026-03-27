"use client"

import { Container } from "@/components/layout/container"
import { Header } from "@/components/ui/navigation-header/header"
import { Spacer } from "@/components/ui/spacer"
import { DeveloperLinks } from "./_comp/DeveloperLinks"
import { DeveloperProfile } from "./_comp/DeveloperProfile"

export default function Page() {
  return (
    <main className="flex-1 px-4" data-vaul-drawer-wrapper="">
      <Spacer className="h-4" />
      <Container as="section" className="flex flex-col gap-6">
        <Header href="/settings" srOnly title="Contact Developer" />
        <DeveloperProfile />
        <DeveloperLinks />
      </Container>
    </main>
  )
}
