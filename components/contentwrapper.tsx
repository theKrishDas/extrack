import { cn } from "@/lib/utils";

export const ContentWrapper = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-8", className)} {...props} />
);

ContentWrapper.displayName = "ContentWrapper";
