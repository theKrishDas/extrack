import Image from "next/image"
import { cn } from "@/lib/utils"

const PROFILE_IMAGE_SIZE = 104

export function ProfileHeader({
  displayName,
  email,
  imageUrl,
  initials,
}: {
  displayName: string
  email: string
  imageUrl: string
  initials: string
}) {
  return (
    <section
      aria-label="Profile overview"
      className={cn(
        "relative overflow-hidden rounded-4xl bg-background-primary-elevated px-6 pt-7 pb-6 shadow-[0_12px_40px_color-mix(in_oklab,var(--foreground)_8%,transparent)]",
        "supports-[corner-shape:squircle]:corner-squircle rounded-2xl supports-[corner-shape:squircle]:rounded-4xl"
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,oklch(from_var(--ios-blue)_l_c_h/0.2),transparent_68%)]" />
      <div className="pointer-events-none absolute -top-10 right-0 size-28 rounded-full bg-[color-mix(in_oklab,var(--ios-cyan)_22%,transparent)] blur-3xl" />
      <div className="mask-[linear-gradient(to_right,transparent,black_46%,black_54%,transparent)] absolute inset-x-0 top-0 h-px bg-ios-cyan opacity-12" />
      <div className="mask-[linear-gradient(to_right,transparent,black_46%,black_54%,transparent)] absolute inset-x-0 top-24 h-px bg-ios-blue opacity-12 dark:opacity-8" />

      <div className="relative flex flex-col items-center text-center">
        <div
          className={cn(
            "relative mb-4 overflow-hidden ring-1 ring-black/5",
            "supports-[corner-shape:squircle]:corner-squircle rounded-3xl supports-[corner-shape:squircle]:rounded-[3rem]"
          )}
        >
          {imageUrl ? (
            <Image
              alt={`${displayName} profile photo`}
              className="size-26 object-cover"
              height={PROFILE_IMAGE_SIZE}
              src={imageUrl}
              unoptimized
              width={PROFILE_IMAGE_SIZE}
            />
          ) : (
            <div className="inline-grid size-26 place-content-center bg-[color-mix(in_oklab,var(--ios-blue)_16%,var(--fill-tertiary))] font-semibold text-3xl text-label-primary">
              {initials}
            </div>
          )}
        </div>

        <h2 className="max-w-full truncate font-semibold text-3xl tracking-tight">
          {displayName}
        </h2>
        <p className="mt-1 max-w-full truncate text-base text-label-secondary">
          {email}
        </p>
      </div>
    </section>
  )
}
