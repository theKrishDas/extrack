import type {Metadata} from "next"
import {Geist, Geist_Mono, Inter} from "next/font/google"

import "./globals.css"

import Provider from "@/components/provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Nextkit - A nextjs starter kit",
  description:
    "Accelerate web development with Nextkit: a pre-configured Next.js, TypeScript, and Tailwind boilerplate.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
