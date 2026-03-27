import type { ReactNode } from "react"
import { Spacer } from "@/components/ui/spacer"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Spacer className="h-24 w-full min-w-1" />
    </>
  )
}
