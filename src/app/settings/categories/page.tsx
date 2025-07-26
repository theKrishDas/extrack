"use client"

import {Header} from "@/components/ui/navigation-header/header"
import {Spacer} from "@/components/ui/spacer"
import {Container} from "@/components/layout/container"

import {Categories} from "../local-comps/Categories"

export default function Page() {
  return (
    <main className="min-h-dvh px-4" data-vaul-drawer-wrapper="">
      <Spacer className="h-4" />
      <Container className="flex flex-col gap-0.5" as="section">
        <Header title="Categories" href="/settings" />
        <Spacer className="h-8" />
        <Categories />
      </Container>
    </main>
  )
}
