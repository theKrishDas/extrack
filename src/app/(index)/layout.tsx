import type { ReactNode } from "react"
import { FloatingNav } from "@/components/app/floating-nav"
import Header from "@/components/app/header"
import { Spacer } from "@/components/ui/spacer"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <FloatingNav />

      {children}

      <Spacer className="h-24 w-full min-w-1" />
    </>
  )
}
