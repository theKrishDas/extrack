"use client"

import { Container } from "@/components/layout/container"
import { Header } from "@/components/ui/navigation-header/header"
import { Spacer } from "@/components/ui/spacer"

import { Accounts as AccountSettings } from "../local-comps/Accounts"

export default function Page() {
  return (
    <main className="min-h-dvh px-4" data-vaul-drawer-wrapper="">
      <Spacer className="h-4" />
      <Container as="section" className="flex flex-col gap-0.5">
        <Header href="/settings" title="Accounts" />
        <Spacer className="h-8" />
        <AccountSettings />
      </Container>
    </main>
  )
}
