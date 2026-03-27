"use client"

import { Container } from "@/components/layout/container"
import { SettingsNav } from "./local-comps/nav"
import { OptionList } from "./local-comps/SettingsOptions"

export default function Page() {
  return (
    <>
      <SettingsNav heading="Settings" href="/" />
      <main className="flex-1 px-4" data-vaul-drawer-wrapper="">
        <Container as="section" className="flex flex-col">
          <OptionList />
        </Container>
      </main>
    </>
  )
}
