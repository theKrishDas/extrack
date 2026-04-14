import { range, scaleBand } from "d3"
import type { ChartProps } from "../types"

/**
 * Chart data.
 *
 * `percentage` must be a value between `0` and `1`, inclusive.
 */
export type ChartData = number

export function Chart(props: ChartProps<{ percentage: ChartData }>) {
  const {
    bound: { height, width },
    percentage,
  } = props

  // --- Controls ---
  const gap = 0.3 as const
  const barRadius = 4 as const
  const barHeight = height
  const barDensity = 0.22 as const

  // --- Calculated ---
  // Derive bar density from container width → prevents bar stretching, ensures full-width fill
  const barCount = Math.max(Math.round(width * gap * barDensity), 1)

  const xScale = scaleBand()
    .domain(range(barCount).map(String))
    .range([0, width])
    .paddingInner(gap)

  return (
    <svg overflow="visible" viewBox={`0 0 ${width} ${height}`}>
      <title>Remaining Balance</title>

      {Array.from({ length: barCount }, (_, idx) => {
        const isWithinUsageRange = idx < Math.round(barCount * percentage)

        return (
          <g
            key={String(idx)}
            transform={`translate(${xScale(String(idx))},0)`}
          >
            <rect
              className={
                isWithinUsageRange
                  ? "text-label-primary"
                  : "text-fill-secondary"
              }
              fill="currentColor"
              height={barHeight}
              rx={barRadius}
              ry={barRadius}
              stroke="none"
              width={xScale.bandwidth()}
            />
          </g>
        )
      })}
    </svg>
  )
}
