"use client"

import {CSSProperties} from "react"
import {Link} from "react-aria-components"

import {Container} from "@/components/layout/container"

import {Accounts as AccountSettings} from "../local-comps/Accounts"

export default function Page() {
  return (
    <main className="min-h-dvh px-4 pt-6" data-vaul-drawer-wrapper="">
      <Container className="flex flex-col gap-0.5" as="section">
        <div className="mt-4 mb-4.5 flex items-center gap-2">
          <Link
            href="/settings"
            className="data-pressed:bg-fill-tertiary text-ios-blue relative w-fit cursor-auto text-xl font-bold"
            style={
              {
                WebkitUserDrag: "none",
                userDrag: "none",
                WebkitTouchCallout: "none",
              } as CSSProperties
            }
          >
            􀆉
            <span className="absolute -inset-x-1.5 inset-y-0" />
          </Link>
          <h3 className="text-2xl font-semibold tracking-tight">Accounts</h3>
        </div>

        <AccountSettings />
      </Container>
    </main>
  )
}
