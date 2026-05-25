"use client"

import { MdAdd } from "react-icons/md"
import { Container } from "@/components/layout/container"
import {
  type QueryParamTabItem,
  QueryParamTabs,
} from "@/components/navigation/query-param-tabs"
import { useQueryParamTabSelection } from "@/components/navigation/query-param-tabs/hooks"
import { Button } from "@/components/ui/button"

export const CATEGORY_TYPE_TAB_ITEMS = [
  { id: "expense", label: "Expense", value: null },
  { id: "income", label: "Income", value: "income" },
] satisfies QueryParamTabItem[]

export function CategoryToolbar() {
  const selectedKey = useQueryParamTabSelection("type", CATEGORY_TYPE_TAB_ITEMS)

  return (
    <div className="pointer-events-none absolute top-4 left-1/2 w-full -translate-x-1/2 px-4 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
      <Container className="relative">
        <QueryParamTabs
          aria-label="Category Filter"
          items={CATEGORY_TYPE_TAB_ITEMS}
          param="type"
          selectedKey={selectedKey}
          tabListClassName="max-w-50"
        />
        {/* TODO: show button when category creation api is up */}
        <Button
          className="absolute top-1/2 right-0 hidden -translate-y-1/2 font-normal"
          color="gray"
          isDisabled
          isIconOnly
        >
          <MdAdd size={24} />
        </Button>
      </Container>
    </div>
  )
}
