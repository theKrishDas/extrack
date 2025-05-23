import { api } from "#/convex/_generated/api"
import { Id } from "#/convex/_generated/dataModel"
import { useQuery } from "convex/react"

export default function CategoryDisplayOnTasks({
  categoryId,
}: {
  categoryId: Id<"categories">
}) {
  const category = useQuery(api.categories.getCategoryById, { id: categoryId })
  if (!category) return

  return (
    <div className="absolute top-0 right-0">
      <span className="text-label-secondary bg-fill-tertiary rounded-md px-[0.2rem] py-0.5 text-xs">
        {category.name}
      </span>
    </div>
  )
}
