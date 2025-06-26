import localFont from "next/font/local"

export const rnxRounded = localFont({
  src: [
    {
      path: "../../public/fonts/rnx-rounded/RNX1Rounded-Ultralight.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/rnx-rounded/RNX1Rounded-Thin.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/rnx-rounded/RNX1Rounded-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/rnx-rounded/RNX1Rounded-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/rnx-rounded/RNX1Rounded-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/rnx-rounded/RNX1Rounded-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/rnx-rounded/RNX1Rounded-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/rnx-rounded/RNX1Rounded-Heavy.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/rnx-rounded/RNX1Rounded-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  display: "swap",
  fallback: ["sans-serif"],
  variable: "--font-rnx-rounded",
})
