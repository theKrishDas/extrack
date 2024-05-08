import { cn } from "@/lib/utils";

export const Main = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => (
  <main className={cn("container space-y-8 py-4", className)} {...props} />
);

Main.displayName = "main";
