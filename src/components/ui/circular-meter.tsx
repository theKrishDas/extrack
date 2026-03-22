"use client"

import type { ComponentProps, ReactNode } from "react"
import { Meter } from "react-aria-components"

import { cn } from "@/lib/utils"

const RING_R = 12
const RING_C = 2 * Math.PI * RING_R

type RacMeterProps = ComponentProps<typeof Meter>

export type CircularMeterProps = Omit<RacMeterProps, "children"> & {
  "aria-label": string
  formatOptions?: Intl.NumberFormatOptions
  /** Center label; defaults to `value`. */
  displayValue?: ReactNode
  /** Muted track, stroke, and label (e.g. empty or disabled). */
  muted?: boolean
  /** SVG `<title>`; defaults to `aria-label`. */
  svgTitle?: string
}

export function CircularMeter(props: CircularMeterProps) {
  const {
    "aria-label": ariaLabel,
    className,
    displayValue,
    formatOptions,
    muted = false,
    svgTitle,
    value,
    ...meterProps
  } = props

  const title = svgTitle ?? ariaLabel
  const center = displayValue ?? value

  return (
    <Meter
      aria-label={ariaLabel}
      className={cn("inline-flex shrink-0", className)}
      formatOptions={formatOptions}
      value={value}
      {...meterProps}
    >
      {({ percentage }) => (
        <span
          aria-hidden
          className="relative inline-flex size-8 items-center justify-center"
        >
          <svg aria-hidden className="size-8" viewBox="0 0 32 32">
            <title>{title}</title>
            <g transform="rotate(-90 16 16)">
              <circle
                className={
                  muted ? "stroke-fill-tertiary" : "stroke-fill-secondary"
                }
                cx="16"
                cy="16"
                fill="none"
                r={RING_R}
                strokeWidth="2.5"
              />
              <circle
                className={muted ? "stroke-label-tertiary" : "stroke-ios-blue"}
                cx="16"
                cy="16"
                fill="none"
                r={RING_R}
                strokeLinecap="round"
                strokeWidth="2.5"
                style={{
                  strokeDasharray: RING_C,
                  strokeDashoffset: RING_C * (1 - percentage / 100),
                }}
              />
            </g>
          </svg>
          <span
            className={cn(
              "absolute font-semibold text-[10px] tabular-nums leading-none",
              muted ? "text-label-tertiary" : "text-label-primary"
            )}
          >
            {center}
          </span>
        </span>
      )}
    </Meter>
  )
}
