"use client"

import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/navigation/page-header"
import { OptionList } from "./local-comps/SettingsOptions"

export default function Page() {
  return (
    <>
      <PageHeader backHref="/" title="Settings" />
      <main className="flex-1 px-4" data-vaul-drawer-wrapper="">
        <Container as="section" className="flex flex-col">
          <OptionList />
        </Container>
      </main>
    </>
  )
}
