import type { ReactNode } from "react"
import { FloatingNav } from "@/components/navigation/floating-nav"
import { Spacer } from "@/components/ui/spacer"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}

      <FloatingNav />
      <Spacer className="h-24 w-full min-w-1" />
    </>
  )
}
