import { Avatar } from "@base-ui/react/avatar"
import { cn } from "@/lib/utils"

const AVATAR_IMAGE_SIZE = 104
const AVATAR_FALLBACK_DELAY_MS = 600

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
        <Avatar.Root
          className={cn(
            "relative mb-4 inline-flex size-26 items-center justify-center overflow-hidden bg-background-primary-elevated align-middle font-semibold text-3xl text-label-primary leading-none shadow-md ring-1 ring-black/5 backdrop-blur-sm",
            "supports-[corner-shape:squircle]:corner-squircle rounded-3xl supports-[corner-shape:squircle]:rounded-[3rem]",

            // outline ring for readability
            "after:absolute after:inset-0 after:mix-blend-overlay after:ring-2 after:ring-white/20 after:ring-inset after:content-['']",
            "supports-[corner-shape:squircle]:after:corner-squircle after:rounded-3xl supports-[corner-shape:squircle]:after:rounded-[3rem]"
          )}
        >
          <Avatar.Image
            alt={`${displayName} profile photo`}
            className="size-full object-cover"
            height={AVATAR_IMAGE_SIZE}
            src={imageUrl}
            width={AVATAR_IMAGE_SIZE}
          />
          <Avatar.Fallback
            className="flex size-full items-center justify-center text-label-secondary"
            delay={AVATAR_FALLBACK_DELAY_MS}
          >
            {initials}
          </Avatar.Fallback>
        </Avatar.Root>

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
