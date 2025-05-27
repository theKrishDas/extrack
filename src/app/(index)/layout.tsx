import {ReactNode} from "react"

export default function Layout({children}: {children: ReactNode}) {
  return (
    <>
      {children}

      {/* // TODO: Maybe convert this an a global component? */}
      <div className="h-14 w-full min-w-1" />
    </>
  )
}
