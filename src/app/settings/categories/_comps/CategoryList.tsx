import type { Doc } from "#/convex/_generated/dataModel"
import { Emoji } from "@/components/ui/emoji"
import { InsetList } from "@/components/ui/inset-list"
import { CategoryActionsMenu } from "./CategoryActionsMenu"

export function CategoryList({
  categories,
}: {
  categories: Doc<"categories">[]
}) {
  return (
    <InsetList.Root>
      <InsetList.Section>
        <InsetList.SectionHeader visuallyHidden>
          <InsetList.SectionTitle>Categories</InsetList.SectionTitle>
        </InsetList.SectionHeader>
        {categories.map((category) => (
          <CategoryListItem category={category} key={category._id} />
        ))}
      </InsetList.Section>
    </InsetList.Root>
  )
}

const CategoryListItem = ({ category }: { category: Doc<"categories"> }) => {
  const { icon, color, name } = category
  return (
    <InsetList.Item
      style={
        {
          "--item-color":
            color === "gray" ? "var(--gray-1)" : `var(--ios-${color})`,
        } as React.CSSProperties
      }
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
        <InsetList.ItemTrailing>
          <CategoryActionsMenu category={category} />
        </InsetList.ItemTrailing>
      </InsetList.ItemContent>
    </InsetList.Item>
  )
}
