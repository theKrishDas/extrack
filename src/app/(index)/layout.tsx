import type { ReactNode } from "react"
import Header from "@/components/app/header"
import { FloatingNav } from "@/components/navigation/floating-nav"
import { Spacer } from "@/components/ui/spacer"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />

      {children}

      <FloatingNav />
      <Spacer className="h-24 w-full min-w-1" />
    </>
  )
}
