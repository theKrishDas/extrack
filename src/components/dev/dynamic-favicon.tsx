"use client"

import { useEffect } from "react"

const DEV_FAVICON_PATH = "/favicon.ico"
const ICON_SELECTOR =
  "link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']"

/**
 * Sets the development favicon when mounted (persists after unmount).
 */
export function DynamicFavicon() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return

    const faviconUrl = new URL(DEV_FAVICON_PATH, window.location.origin)
    faviconUrl.searchParams.set("v", Date.now().toString())

    const iconLinks = document.querySelectorAll<HTMLLinkElement>(ICON_SELECTOR)

    for (const iconLink of iconLinks) {
      iconLink.href = faviconUrl.toString()
    }

    if (iconLinks.length > 0) return

    const iconLink = document.createElement("link")
    iconLink.rel = "icon"
    iconLink.href = faviconUrl.toString()
    document.head.appendChild(iconLink)
  }, [])

  return null
}
