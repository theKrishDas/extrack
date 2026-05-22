import type { IconProps } from "../icons/types"

export function SplashScreen() {
  return (
    <div className="pointer-events-none fixed inset-0 z-100 grid select-none place-content-center bg-background">
      <span
        aria-hidden={true}
        className="animate-pulse text-3xl text-label-secondary leading-none"
      >
        <AppIcon />
      </span>
      <span className="sr-only">Loading…</span>
    </div>
  )
}

// TODO: Design a good app icon in future
const AppIcon = ({ size = "1em", ...props }: IconProps) => (
  <svg
    fill="currentColor"
    height={size}
    viewBox="0 0 26 18"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Extrack icon</title>
    <path
      d="M25.102 8.977a8.7 8.7 0 0 1-.704 3.48 9 9 0 0 1-1.933 2.871 9.1 9.1 0 0 1-2.86 1.934 8.8 8.8 0 0 1-3.48.691q-.726 0-1.453-.129a10.4 10.4 0 0 0 2.555-2.308 10.7 10.7 0 0 0 1.71-3.036q.61-1.664.61-3.503 0-1.853-.61-3.516a10.5 10.5 0 0 0-1.71-3.024A10.4 10.4 0 0 0 14.672.13a8.7 8.7 0 0 1 4.934.574 8.9 8.9 0 0 1 2.859 1.934 8.9 8.9 0 0 1 1.933 2.86 8.6 8.6 0 0 1 .704 3.48M8.977 17.953a8.8 8.8 0 0 1-3.493-.691 9.3 9.3 0 0 1-2.859-1.934 9.3 9.3 0 0 1-1.934-2.871A8.8 8.8 0 0 1 0 8.977q0-1.865.691-3.48A9.1 9.1 0 0 1 5.484.702 8.7 8.7 0 0 1 8.977 0q1.851 0 3.48.703a8.9 8.9 0 0 1 2.86 1.934 8.9 8.9 0 0 1 1.933 2.86 8.6 8.6 0 0 1 .703 3.48 8.7 8.7 0 0 1-.703 3.48 9 9 0 0 1-1.934 2.871 9.1 9.1 0 0 1-2.859 1.934 8.8 8.8 0 0 1-3.48.691"
      fill="currentColor"
    />
  </svg>
)
