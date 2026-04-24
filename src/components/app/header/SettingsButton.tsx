"use client"

import Link from "next/link"
import { IoPersonCircle } from "react-icons/io5"

export function SettingsButton() {
  return (
    <Link className="h-fit w-fit cursor-default" href="/settings">
      <IoPersonCircle aria-hidden="true" />
      <span className="sr-only">Settings</span>
    </Link>
  )
}
