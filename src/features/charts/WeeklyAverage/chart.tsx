import { max, scaleBand, scaleLinear } from "d3"
import type { ChartProps } from "../types"

export type ChartData = { date: Date | number | string; value: number }

export function Chart(props: ChartProps<{ data: ChartData[] }>) {
  const {
    bound: { height, width },
    data,
  } = props

  const dates = data.map((d) => String(d.date))
  const xScale = scaleBand()
    .domain(dates.map((d) => d))
    .range([0, width])
    .paddingInner(0.3)

  const values = data.map((d) => d.value)
  const yScale = scaleLinear()
    .domain([0, max(values) ?? 0])
    .range([0, height])

  const sum = values.reduce((acc, v) => acc + v, 0)
  const average = Math.round(sum / values.length)
  const avgBarY = yScale(average)

  return (
    <svg
      className="size-full"
      overflow="visible"
      viewBox={`0 0 ${width} ${height}`}
    >
      <title>Weekly Activity</title>
      {data.map((data) => {
        const x = xScale(data.date.toString())
        const barHeight = yScale(data.value)
        const barRadius = 5

        return (
          <g
            className="text-label-tertiary"
            key={data.date.toString()}
            transform={`translate(${x},${height}) scale(1,-1)`}
          >
            <rect
              fill="currentColor"
              height={barHeight}
              rx={barRadius}
              ry={barRadius}
              width={xScale.bandwidth()}
            />
          </g>
        )
      })}

      <g transform={`translate(0,${height - avgBarY}) scale(1,-1)`}>
        <line
          className="text-label-primary"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={3}
          x2={width}
        />
      </g>
    </svg>
  )
}
