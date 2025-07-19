export function Spinner(props: React.SVGProps<SVGSVGElement>) {
  return <Icon {...props} />
}

export function Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Icon from SVG Spinners by Utkarsh Verma - https://github.com/n3r4zzurr0/svg-spinners/blob/main/LICENSE */}
      <g>
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".14"
        />
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".29"
          transform="rotate(30 12 12)"
        />
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".43"
          transform="rotate(60 12 12)"
        />
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".57"
          transform="rotate(90 12 12)"
        />
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".71"
          transform="rotate(120 12 12)"
        />
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".86"
          transform="rotate(150 12 12)"
        />
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          transform="rotate(180 12 12)"
        />
        <animateTransform
          attributeName="transform"
          calcMode="discrete"
          dur="0.75s"
          repeatCount="indefinite"
          type="rotate"
          values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
        />
      </g>
    </svg>
  )
}

export function EiSpinner(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 50 50"
      {...props}
    >
      {/* Icon from Evil Icons by Alexander Madyankin and Roman Shamin - https://github.com/evil-icons/evil-icons/blob/master/LICENSE.txt */}
      <path
        fill="currentColor"
        d="M25 18c-.6 0-1-.4-1-1V9c0-.6.4-1 1-1s1 .4 1 1v8c0 .6-.4 1-1 1"
      />
      <path
        fill="currentColor"
        d="M25 42c-.6 0-1-.4-1-1v-8c0-.6.4-1 1-1s1 .4 1 1v8c0 .6-.4 1-1 1m4-23c-.2 0-.3 0-.5-.1c-.4-.3-.6-.8-.3-1.3l4-6.9c.3-.4.8-.6 1.3-.3c.4.3.6.8.3 1.3l-4 6.9c-.2.2-.5.4-.8.4M17 39.8c-.2 0-.3 0-.5-.1c-.4-.3-.6-.8-.3-1.3l4-6.9c.3-.4.8-.6 1.3-.3c.4.3.6.8.3 1.3l-4 6.9c-.2.2-.5.4-.8.4"
        opacity=".3"
      />
      <path
        fill="currentColor"
        d="M21 19c-.3 0-.6-.2-.8-.5l-4-6.9c-.3-.4-.1-1 .3-1.3s1-.1 1.3.3l4 6.9c.3.4.1 1-.3 1.3c-.2.2-.3.2-.5.2"
        opacity=".93"
      />
      <path
        fill="currentColor"
        d="M33 39.8c-.3 0-.6-.2-.8-.5l-4-6.9c-.3-.4-.1-1 .3-1.3s1-.1 1.3.3l4 6.9c.3.4.1 1-.3 1.3c-.2.1-.3.2-.5.2"
        opacity=".3"
      />
      <path
        fill="currentColor"
        d="M17 26H9c-.6 0-1-.4-1-1s.4-1 1-1h8c.6 0 1 .4 1 1s-.4 1-1 1"
        opacity=".65"
      />
      <path
        fill="currentColor"
        d="M41 26h-8c-.6 0-1-.4-1-1s.4-1 1-1h8c.6 0 1 .4 1 1s-.4 1-1 1"
        opacity=".3"
      />
      <path
        fill="currentColor"
        d="M18.1 21.9c-.2 0-.3 0-.5-.1l-6.9-4c-.4-.3-.6-.8-.3-1.3c.3-.4.8-.6 1.3-.3l6.9 4c.4.3.6.8.3 1.3c-.2.3-.5.4-.8.4"
        opacity=".86"
      />
      <path
        fill="currentColor"
        d="M38.9 33.9c-.2 0-.3 0-.5-.1l-6.9-4c-.4-.3-.6-.8-.3-1.3c.3-.4.8-.6 1.3-.3l6.9 4c.4.3.6.8.3 1.3c-.2.3-.5.4-.8.4"
        opacity=".3"
      />
      <path
        fill="currentColor"
        d="M11.1 33.9c-.3 0-.6-.2-.8-.5c-.3-.4-.1-1 .3-1.3l6.9-4c.4-.3 1-.1 1.3.3s.1 1-.3 1.3l-6.9 4c-.1.2-.3.2-.5.2"
        opacity=".44"
      />
      <path
        fill="currentColor"
        d="M31.9 21.9c-.3 0-.6-.2-.8-.5c-.3-.4-.1-1 .3-1.3l6.9-4c.4-.3 1-.1 1.3.3s.1 1-.3 1.3l-6.9 4c-.2.2-.3.2-.5.2"
        opacity=".3"
      />
    </svg>
  )
}
