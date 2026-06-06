import { AiOutlineExclamationCircle } from "react-icons/ai"
import { BiTrash } from "react-icons/bi"
import { Button } from "@/components/ui/button"

export function DeleteCategory({
  name: categoryName,
  onCancel,
  onDelete,
}: {
  name: string
  onCancel?: () => void
  onDelete?: () => void
}) {
  return (
    <div className="mx-auto flex max-w-75 flex-col items-center gap-3 px-4 pt-0 pb-6 text-center">
      <AiOutlineExclamationCircle className="text-4xl text-ios-red dark:mix-blend-plus-lighter" />
      <p className="font-semibold text-2xl">Delete {categoryName}?</p>
      <p className="text-label-secondary leading-tight tracking-wide">
        This will permanently delete this category and all its transactions.
      </p>
      <div className="mt-3 flex w-full flex-row-reverse gap-1 [&_button]:flex-1">
        <Button color="red" onPress={onDelete} variant="filled">
          <BiTrash />
          Delete
        </Button>
        <Button color="gray" onPress={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
