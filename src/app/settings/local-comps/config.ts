import type { Colors } from "#lib/constants/colors"
import { BUILD_METADATA } from "@/lib/runtime"

export type SettingsOption = {
  name: string
  label: string
  href?: string
  icon: string
  iconColor: Colors
  trailing: "chevron" | "external-link" | null
  trailingDetail?: string
  external?: boolean
}

export type SettingsGroup = {
  name: string
  label: string
  options: SettingsOption[]
}

export const settingsConfig: SettingsGroup[] = [
  {
    name: "accounts-categories",
    label: "Accounts & Categories",
    options: [
      {
        name: "accounts",
        label: "Accounts",
        href: "/settings/accounts",
        icon: "􀑇",
        trailing: "chevron",
        iconColor: "red",
      },
      {
        name: "categories",
        label: "Categories",
        href: "/settings/categories",
        icon: "􀋢", // tag
        trailing: "chevron",
        iconColor: "yellow",
      },
    ],
  },
  {
    name: "appearance",
    label: "Appearance",
    options: [
      {
        name: "theme",
        label: "Theme",
        href: "/settings/appearance",
        icon: "􀆸",
        trailing: "chevron",
        iconColor: "indigo",
      },
    ],
  },
  {
    label: "Support",
    name: "support",
    options: [
      {
        name: "contact-developer",
        label: "Contact Developer",
        href: "/settings/contact",
        icon: "􀉪",
        iconColor: "blue",
        trailing: "chevron",
      },
    ],
  },
  {
    label: "About",
    name: "about",
    options: [
      {
        name: "version",
        label: "Version",
        icon: "􀐬",
        iconColor: "gray",
        href: "https://github.com/thekrishdas/extrack/releases",
        trailing: "external-link",
        external: true,
        trailingDetail: BUILD_METADATA.version,
      },
    ],
  },
]
