"use client"

import Link from "next/link"
import { IoPersonCircle } from "react-icons/io5"

export function SettingsButton() {
  return (
    <Link
      className="h-fit w-fit cursor-default"
      href="/settings"
      style={
        // TODO: extract these options to somewhere reasonable
        {
          WebkitUserDrag: "none",
          userDrag: "none",
          WebkitTouchCallout: "none",
          cursor: "default",
          userSelect: "none",
          msUserSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
        } as React.CSSProperties
      }
    >
      <IoPersonCircle aria-hidden="true" />
      <span className="sr-only">Settings</span>
    </Link>
  )
}
