"use client";

import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchInfiniteTransactions } from "@/actions/handleCachedTransaction";
import { TRANSACTION_PER_PAGE_FETCH_LIMIT } from "@/lib/defaultValues";
import InfiniteTransactionWrapper from "./InfiniteTransactionSkeleton";
import TransactionItem from "@/components/transactions/TransactionItem";
import EndOfTransaction from "@/components/transactions/EndOfTransaction";

export default function InfiniteTransactionList() {
  const { data, status, error, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["transaction"],
    queryFn: async ({ pageParam = 0 }) => fetchInfiniteTransactions(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.data.length < TRANSACTION_PER_PAGE_FETCH_LIMIT
        ? undefined
        : lastPage.nextOffset,
    initialPageParam: 0,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView, fetchNextPage]);

  return status === "pending" ? (
    <InfiniteTransactionWrapper />
  ) : status === "error" ? (
    <p>{error.message}</p>
  ) : (
    <div className="space-y-1">
      {data.pages.map((page, idx) => (
        <Fragment key={idx}>
          {page.data.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </Fragment>
      ))}

      {/* TODO: don't always render 12 skeletons, canculate the number. */}
      <div ref={ref}>
        {hasNextPage ? <InfiniteTransactionWrapper /> : <EndOfTransaction />}
      </div>
    </div>
  );
}
