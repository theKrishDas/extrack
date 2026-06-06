import { useRef } from "react"
import type { Doc } from "#/convex/_generated/dataModel"
import { ExperimentalDynamicDrawer as DynamicDrawer } from "@/components/ui/drawer/dynamic-drawer"
import { CategoryDetail } from "./CategoryDetail"
import { DeleteCategory } from "./DeleteCategory"

export function CategoryDrawer({
  open,
  setOpen,
  category,
  onDelete,
  onEdit,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  category: Doc<"categories"> | null
  onDelete?: () => void
  onEdit?: () => void
}) {
  const lastCategory = useRef(category)
  if (category !== null) lastCategory.current = category

  const display = category ?? lastCategory.current

  if (!display)
    // TODO(axiom): replace console.warn with axiom structured log
    console.warn("[CategoryDrawer] category=null on mount", {
      level: "warn",
      component: "CategoryDrawer",
      event: "null_category_on_mount",
      open,
    })

  // `display` is null only before the drawer has ever been opened (cold mount).
  // In normal flow, `setActiveCategory` is always called before `setOpen`,
  // so this branch is unreachable at runtime. The non-null assertion is safe.
  const safeDisplay = display as Doc<"categories">

  type DrawerView = "details" | "delete"

  return (
    <DynamicDrawer<DrawerView>
      initialLevel="details"
      levels={{
        details: {
          title: "Details",
          content: ({ navigate }) => (
            <CategoryDetail
              category={safeDisplay}
              onDelete={() => navigate("delete")}
              onEdit={onEdit}
            />
          ),
        },
        delete: {
          title: "Delete Category",
          content: ({ navigate }) => (
            <DeleteCategory
              name={safeDisplay.name}
              onCancel={() => navigate("details")}
              onDelete={onDelete}
            />
          ),
        },
      }}
      onOpenChange={setOpen}
      open={open}
    />
  )
}
