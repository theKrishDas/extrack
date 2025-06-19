import {ReactNode} from "react"

import {Dock} from "@/components/app/dock"

export default function Layout({children}: {children: ReactNode}) {
  return (
    <>
      <Dock />

      {children}

      {/* // TODO: Maybe convert this an a global component? */}
      <div className="h-48 w-full min-w-1" />
    </>
  )
}
