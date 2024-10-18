import { Skeleton } from "@/components/ui/skeleton";
import { TRANSACTION_PER_PAGE_FETCH_LIMIT } from "@/lib/defaultValues";
import { forwardRef, DetailedHTMLProps, HTMLAttributes } from "react";

type Props = {} & Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
  "children"
>;

//  TODO: don't always render 12 skeletons, canculate the number. */
export const InfiniteTransactionSkeletonWrapper = forwardRef<
  HTMLDivElement,
  Props
>((props, ref) => (
  <section
    ref={ref}
    className="transaction-skeleton__wrapper space-y-1"
    {...props}
  >
    {Array.from({ length: TRANSACTION_PER_PAGE_FETCH_LIMIT }).map((_, idx) => (
      <TransactionSkeleton key={idx} />
    ))}
  </section>
));
InfiniteTransactionSkeletonWrapper.displayName =
  "InfiniteTransactionSkeletonWrapper";

export function TransactionSkeleton() {
  return <Skeleton className="h-[4.5rem] w-full rounded-md" />;
}
