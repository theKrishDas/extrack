export const colors = [
  "gray",
  "blue",
  "red",
  "orange",
  "yellow",
  "green",
  "mint",
  "teal",
  "cyan",
  "indigo",
  "purple",
  "pink",
  "brown",
] as const
export type Colors = (typeof colors)[number]
