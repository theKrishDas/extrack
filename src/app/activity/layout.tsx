import type { ReactNode } from "react"
import { Dock } from "@/components/app/dock"
import { Spacer } from "@/components/ui/spacer"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Dock />

      {children}

      <Spacer className="h-48 w-full min-w-1" />
    </>
  )
}
