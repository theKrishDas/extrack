export function CalendarToday(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Calendar Today</title>
      {/* Icon from css.gg by Astrit - https://github.com/astrit/css.gg/blob/master/LICENSE */}
      <g fill="currentColor">
        <path d="M15 17a2 2 0 1 0 0-4a2 2 0 0 0 0 4" />
        <path
          clipRule="evenodd"
          d="M6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zM5 18V7h14v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1"
          fillRule="evenodd"
        />
      </g>
    </svg>
  )
}
