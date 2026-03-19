"use client"

/**
 * @deprecated Use `FloatingNav` from `@/components/navigation` instead.
 */

import { FAB } from "./FAB"
import { Navigation } from "./Navigation"

/**
 * @deprecated Use `FloatingNav` from `@/components/navigation` instead.
 */
export function FloatingNav() {
  return (
    <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5">
      <Navigation.Root>
        <Navigation.Item href="/" icon={"􀊵"}>
          Summary
        </Navigation.Item>
        <Navigation.Item href="/activity" icon={"􁐔"}>
          Activity
        </Navigation.Item>
      </Navigation.Root>

      <FAB />
    </div>
  )
}
