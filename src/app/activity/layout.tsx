import {ReactNode} from "react"

import {Spacer} from "@/components/ui/spacer"
import {Dock} from "@/components/app/dock"

export default function Layout({children}: {children: ReactNode}) {
  return (
    <>
      <Dock />

      {children}

      <Spacer className="h-48 w-full min-w-1" />
    </>
  )
}
