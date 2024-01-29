import type { BottomNavContentType } from "@/lib/types/bottom-nav-content";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function BottomNavLink({
  prop,
}: {
  prop: BottomNavContentType;
}) {
  return (
    <Link
      href={prop.href}
      className="flex flex-col items-center justify-center text-2xl"
    >
      <span className={cn("text-foreground/90", prop.is_active && "text-80")}>
        {prop.is_active ? prop.activeIcon : prop.inActiveIcon}
      </span>
      <p
        className={cn(
          "select-none text-xs font-medium text-foreground/60",
          prop.is_active && "font-semibold text-foreground/90",
        )}
      >
        {prop.name}
      </p>
    </Link>
  );
}
