import type { ReactNode } from "react"
import { FloatingNav } from "@/components/app/floating-nav"
import { Spacer } from "@/components/ui/spacer"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <FloatingNav />

      {children}

      <Spacer className="h-48 w-full min-w-1" />
    </>
  )
}
