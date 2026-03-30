import { WHITESPACE } from "#lib/regex"

export const getInitials = (fullName: string | null | undefined) => {
  if (!fullName) return "U"
  return fullName
    .trim()
    .split(WHITESPACE)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}
