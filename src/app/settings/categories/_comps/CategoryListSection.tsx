"use client"

import { useQuery } from "convex-helpers/react/cache"
import { api } from "#/convex/_generated/api"
import type { TransactionTypes } from "#lib/constants/transaction-types"
import { Spinner } from "@/components/loading/spinner"
import { useQueryParamTabSelection } from "@/components/navigation/query-param-tabs/hooks"
import { CategoryList } from "./CategoryList"
import { CATEGORY_TYPE_TAB_ITEMS } from "./CategoryToolbar"

export default function CategoryListSection() {
  /** @todo: properly type useQueryParamTabSelection to infer from its items arg */
  const selectedType = useQueryParamTabSelection(
    "type",
    CATEGORY_TYPE_TAB_ITEMS
  ) as TransactionTypes | undefined
  const categories = useQuery(
    api.category.listByType,
    selectedType ? { type: selectedType } : "skip"
  )
  const isLoading = categories === undefined

  if (isLoading) return <Spinner />

  return <CategoryList categories={categories} />
}
