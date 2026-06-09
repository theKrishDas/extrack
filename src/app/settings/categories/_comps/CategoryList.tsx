"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Button as RacButton } from "react-aria-components"
import type { Doc } from "#/convex/_generated/dataModel"
import { colorToCSSVar } from "#lib/utils/colors"
import { Emoji } from "@/components/ui/emoji"
import { InsetList } from "@/components/ui/inset-list"
import { CategoryDrawer } from "./CategoryDrawer"

const EditCategoryDrawer = dynamic(
  () => import("./EditCategoryDrawer").then((mod) => mod.EditCategoryDrawer),
  { ssr: false }
)

export function CategoryList({
  categories,
}: {
  categories: Doc<"categories">[]
}) {
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false)
  const [activeCategory, setActiveCategory] =
    useState<Doc<"categories"> | null>(null)

  const [editOpen, setEditOpen] = useState<boolean>(false)

  return (
    <>
      <InsetList.Root>
        <InsetList.Section>
          <InsetList.SectionHeader visuallyHidden>
            <InsetList.SectionTitle>Categories</InsetList.SectionTitle>
          </InsetList.SectionHeader>
          {categories.map((category) => (
            <CategoryListItem
              category={category}
              isDisabled={detailsOpen || editOpen}
              key={category._id}
              onPress={() => {
                setActiveCategory(category)
                setDetailsOpen(true)
              }}
            />
          ))}
        </InsetList.Section>
      </InsetList.Root>

      <CategoryDrawer
        category={activeCategory}
        onEdit={() => {
          setDetailsOpen(false)
          setEditOpen(true)
        }}
        open={detailsOpen}
        setOpen={setDetailsOpen}
      />

      {activeCategory && (
        <EditCategoryDrawer
          afterEdit={() => setEditOpen(false)}
          category={activeCategory}
          onOpenChange={(v) => setEditOpen(v)}
          open={editOpen}
        />
      )}
    </>
  )
}

const CategoryListItem = ({
  category,
  onPress,
  isDisabled,
}: {
  category: Doc<"categories">
  onPress?: () => void
  isDisabled?: boolean
}) => {
  const { icon, color, name } = category

  return (
    <InsetList.Item
      className="no-drag pointer-events-none relative"
      style={{ "--item-color": colorToCSSVar(color) } as React.CSSProperties}
    >
      <InsetList.ItemLeading className="gap-4">
        <span className="size-3 rounded-full bg-(--item-color)/(--fill-secondary-opacity) outline-(--item-color) outline-2" />
        <InsetList.ItemMedia aria-hidden="true" variant="symbol">
          <Emoji className="text-lg">{icon}</Emoji>
        </InsetList.ItemMedia>
      </InsetList.ItemLeading>

      <InsetList.ItemContent>
        <InsetList.ItemBody>
          <InsetList.ItemTitle>{name}</InsetList.ItemTitle>
        </InsetList.ItemBody>
      </InsetList.ItemContent>

      <RacButton
        aria-label={`Open details for ${name}`}
        className="pointer-events-auto absolute inset-0"
        isDisabled={isDisabled}
        onPress={onPress}
      />
    </InsetList.Item>
  )
}
