"use client"

import { Container } from "@/components/layout/container"
import { Header } from "@/components/ui/navigation-header/header"
import { Spacer } from "@/components/ui/spacer"

import { Categories } from "../local-comps/Categories"

export default function Page() {
  return (
    <main className="min-h-dvh px-4" data-vaul-drawer-wrapper="">
      <Spacer className="h-4" />
      <Container as="section" className="flex flex-col gap-0.5">
        <Header href="/settings" title="Categories" />
        <Spacer className="h-8" />
        <Categories />
      </Container>
    </main>
  )
}
