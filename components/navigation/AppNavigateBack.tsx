"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

/**
 * Displays a navigation header with a back arrow, heading, and optional children.
 *
 * @param {string} props.heading - The main heading (h1) identifying the page.
 * @param {string} [props.href] - Optional. If provided, redirects to the given href; defaults to `router.back()` if not specified.
 * @param {React.ReactNode} [props.icon] - Optional. If provided, uses the specified icon; defaults to Arrow-Back.
 * @param {React.ReactNode} [props.children] - Optional. Renders children after the heading with 'flex' and 'justify-center'.
 * @returns {React.ReactNode} - The navigation header.
 */
export default function BackNavigation({
  heading,
  href,
  icon = <IoArrowBack />,
  children,
}: {
  heading: string;
  href?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <section className="flex h-8 items-center justify-between">
      <div className="flex items-center gap-2">
        <Link
          href={href || ""}
          onClick={(e) => {
            if (!!href) return;

            e.preventDefault();
            router.back();
          }}
          className={cn(
            "inline-grid aspect-square h-full place-content-center rounded-full text-xl",

            "hover:bg-secondary",

            "focus:outline-none focus-visible:outline-none",
            "focus-visible:ring-2",

            "transition-all",
          )}
        >
          {icon}
        </Link>
        <h1 className="font-semibold">{heading}</h1>
      </div>
      {children}
    </section>
  );
}
