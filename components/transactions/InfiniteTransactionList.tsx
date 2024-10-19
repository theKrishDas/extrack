"use client";

import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchInfiniteTransactions } from "@/actions/handleCachedTransaction";
import { TRANSACTION_PER_PAGE_FETCH_LIMIT } from "@/lib/defaultValues";
import { InfiniteTransactionSkeletonWrapper } from "./InfiniteTransactionSkeleton";
import TransactionItem from "@/components/transactions/TransactionItem";
import EndOfTransaction from "@/components/transactions/EndOfTransaction";

export default function InfiniteTransactionList() {
  const { data, status, error, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["transactions"],
      queryFn: async ({ pageParam = 0 }) =>
        fetchInfiniteTransactions(pageParam),
      getNextPageParam: (lastPage) =>
        lastPage.ungroupedTransactions.length < TRANSACTION_PER_PAGE_FETCH_LIMIT
          ? undefined
          : lastPage.nextOffset,
      initialPageParam: 0,
    });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView, fetchNextPage]);

  return status === "pending" ? (
    <InfiniteTransactionSkeletonWrapper />
  ) : status === "error" ? (
    <p>{error.message}</p>
  ) : (
    <section className="space-y-1">
      {data.pages.map((page, pageIdx) => {
        const previousPage = data.pages[pageIdx - 1];
        const lastTransactionGroupInPreviousPage =
          previousPage?.groupedTransactions.at(-1);
        const lastTransactionDate = lastTransactionGroupInPreviousPage?.Date;

        return (
          <Fragment key={pageIdx}>
            {page.groupedTransactions.map((group, groupIdx) => {
              const splitDate = group.Date.split(" ");

              return (
                <div
                  key={groupIdx}
                  className="transaction-group__wraper space-y-1"
                >
                  {/* --- --- --- group Date ---  ---  ---  */}
                  {group.Date !== lastTransactionDate && (
                    <div className="group-date mt-4 inline-flex w-full items-center gap-3 py-2 pl-1">
                      <p className="text-base leading-none text-primary/40">
                        <span className="font-extrabold -uppercase">
                          {splitDate[0]}
                        </span>{" "}
                        <span className="">{splitDate[1]}</span>
                      </p>
                      <div className="mb-px h-[2px] w-full flex-1 bg-primary/10" />
                    </div>
                  )}

                  {/* --- --- --- Transactions ---  ---  ---  */}
                  <div className="transaction-item__wrapper space-y-1">
                    {group.transactions.map((transactions) => (
                      <TransactionItem
                        key={transactions.id}
                        transaction={transactions}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </Fragment>
        );
      })}

      {/* --- --- --- Loader and trigger ---  ---  ---  */}
      {hasNextPage && isFetching && <InfiniteTransactionSkeletonWrapper />}
      {hasNextPage ? (
        !isFetching && (
          <InfiniteTransactionSkeletonWrapper
            className="transactions-infinite-scroll__trigger"
            ref={ref}
          />
        )
      ) : (
        <EndOfTransaction />
      )}
    </section>
  );
}
