import Link from "next/link"
import { Container } from "@/components/layout/container"
import { buttonVariants } from "@/components/ui/button/button-variants"
import { cn } from "@/lib/utils"

export interface PageHeaderProps {
  title: string
  /** href passed to the back button Link. Note: does not use router history — prefer a stable route. */
  backHref: string
  /** Visually hides the title (still accessible to screen readers). */
  visuallyHidden?: boolean
  /**
   * Bottom margin as a unitless Tailwind spacing multiplier.
   * Multiplied against `--spacing` CSS variable. Example: `4` → `calc(4 * var(--spacing))`.
   */
  margin?: number
}

export function PageHeader({
  title,
  backHref,
  visuallyHidden = false,
  margin = 4,
}: PageHeaderProps) {
  return (
    <div
      className="relative mt-4 flex items-center justify-center px-4"
      style={{ marginBottom: `calc(${margin} * var(--spacing))` }}
    >
      <Container asChild>
        <header className="relative flex items-center">
          <Link
            className={cn(
              buttonVariants({
                color: "gray",
                isIconOnly: true,
                className:
                  "font-semibold text-lg shadow-ios-sm [--button-bg:var(--background-primary-elevated)] sm:text-base",
              })
            )}
            href={backHref}
          >
            􀆉
          </Link>

          <div className="pointer-events-none absolute inset-x-0 flex h-fit min-w-0 select-none items-center justify-center">
            <h1
              className={cn(
                "max-w-[65%] truncate font-semibold text-[1.15rem] text-label-primary leading-snug",
                visuallyHidden && "sr-only"
              )}
            >
              {title}
            </h1>
          </div>
        </header>
      </Container>
    </div>
  )
}
