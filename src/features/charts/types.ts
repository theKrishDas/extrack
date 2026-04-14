/**
 * Props shape for chart components that need container dimensions plus
 * chart-specific data or options.
 *
 * `T` is merged with a required `bound` object, so each chart receives
 * `width` and `height` alongside its own props.
 *
 * @example
 * type LineChartProps = ChartProps<{
 *   data: { date: Date; value: number }[]
 * }>
 *
 * @example
 * function Chart({
 *   bound: { width, height },
 *   data,
 * }: ChartProps<{ data: { date: Date; value: number }[] }>) {
 *   return null
 * }
 */
export type ChartProps<T extends Record<string, unknown>> = {
  bound: {
    width: number
    height: number
  }
} & T
