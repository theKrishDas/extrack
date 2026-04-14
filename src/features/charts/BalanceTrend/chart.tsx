import { curveMonotoneX, extent, line, max, scaleLinear, scaleTime } from "d3"
import { format } from "date-fns"
import type { ChartProps } from "../types"

export interface ChartData {
  date: Date
  balance: number
}

export function Chart(props: ChartProps<{ data: ChartData[] }>) {
  const {
    bound: { height, width },
    data,
  } = props

  if (!data?.length) return

  const bottomAxisGap = 18
  const chartWidth = width
  const chartHeight = height - bottomAxisGap

  const xScale = scaleTime()
    .domain(extent(data.map((d) => d.date)) as [Date, Date])
    .range([0, chartWidth])
  const yScale = scaleLinear()
    .domain([0, max(data.map((d) => d.balance)) ?? 0])
    .range([0, chartHeight])

  const linePath = line<ChartData>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.balance))
    .curve(curveMonotoneX)

  const lastDateLabel = format(data.at(-1)?.date ?? Date.now(), "dd")

  const pillWidth = 3
  const pillHeight = 8

  return (
    <svg
      className="size-full"
      overflow="visible"
      viewBox={`0 0 ${width} ${height}`}
    >
      <title>Balance Trend for past 30 days</title>
      <g transform={`translate(0,${chartHeight}) scale(1,-1)`}>
        {/* --- Axes --- */}
        <path
          className="text-label-secondary"
          d={`M 0 0 L ${chartWidth} 0 ${chartWidth} ${chartHeight}`}
          fill="none"
          stroke="currentColor"
          strokeDasharray="2,6"
          x2={width}
        />

        {/* --- Line Path (Trend) --- */}
        <path
          className="text-label-primary"
          d={linePath(data) ?? undefined}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={5}
        />

        {/* --- Pill (Above the date) --- */}
        <rect
          className="text-label-primary"
          fill="currentColor"
          height={pillHeight}
          rx={2}
          ry={2}
          transform={`translate(-${pillWidth / 2},-${pillHeight / 2})`}
          width={pillWidth}
          x={chartWidth}
        />
      </g>

      {/* --- Date --- */}
      <g transform={`translate(${chartWidth},${height})`}>
        <text
          className="font-medium text-label-secondary text-xs"
          fill="currentColor"
          textAnchor="middle"
        >
          {lastDateLabel}
        </text>
      </g>
    </svg>
  )
}
