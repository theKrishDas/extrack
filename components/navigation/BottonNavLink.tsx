"use client";

import type { BottomNavContentType } from "@/lib/types/bottom-nav-content";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNavLink({
  prop,
}: {
  prop: BottomNavContentType;
}) {
  const pathname = usePathname();

  const isLinkActive = pathname === prop.href;

  return (
    <Link
      href={prop.href}
      className="flex flex-col items-center justify-center text-2xl"
    >
      <span className={cn("text-foreground/90", isLinkActive && "text-80")}>
        {isLinkActive ? prop.activeIcon : prop.inActiveIcon}
      </span>
      <p
        className={cn(
          "select-none text-xs font-medium text-foreground/60",
          isLinkActive && "font-semibold text-foreground/90",
        )}
      >
        {prop.name}
      </p>
    </Link>
  );
}
