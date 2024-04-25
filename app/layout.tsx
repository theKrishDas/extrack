import Provider from "@/providers/Provider";
import { Toaster } from "@/components/ui/sonner";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Extrack — Track your expenses",
  description:
    "Extrack is a simple and intuitive expense tracking app that helps you stay on top of your finances.",
  keywords: "expense tracker, finances, budgeting, money management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <Provider>{children}</Provider>
        <Toaster />
      </body>
    </html>
  );
}
