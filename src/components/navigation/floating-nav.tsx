"use client"

import { Spacer } from "../ui/spacer"
import { FAB } from "./FAB"
import { Navigation } from "./Navigation"

export function FloatingNav() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center justify-center">
      <Navigation.Root>
        <Navigation.Item href="/" icon="􀊵">
          Summary
        </Navigation.Item>
        <Navigation.Item href="/activity" icon="􁐔">
          Activity
        </Navigation.Item>
      </Navigation.Root>

      <Spacer className="h-px w-1.5" />
      <FAB />
    </nav>
  )
}
