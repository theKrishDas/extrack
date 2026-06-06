import { ark } from "@ark-ui/react"
import { useQuery } from "convex-helpers/react/cache"
import { BiTrash } from "react-icons/bi"
import { LuShieldAlert } from "react-icons/lu"
import { MdInvertColors } from "react-icons/md"
import { api } from "#/convex/_generated/api"
import type { Doc } from "#/convex/_generated/dataModel"
import type { Colors } from "#lib/constants/colors"
import { colorToCSSVar } from "#lib/utils/colors"
import { TransactionTypeIcon } from "@/components/icons/TransactionTypeIcon"
import { Button } from "@/components/ui/button"
import { Emoji } from "@/components/ui/emoji"
import { Spacer } from "@/components/ui/spacer"
import { cn } from "@/lib/utils"
import { CategoryStats } from "./CategoryStats"

export function CategoryDetail({
  category,
  onEdit,
  onDelete,
}: {
  category: Doc<"categories">
  onEdit?: () => void
  onDelete?: () => void
}) {
  // TODO(UPS-27): Replace with aggregate query returning { count, sum } — avoid full scan via listByCategory
  const transactions = useQuery(api.transaction.listByCategory, {
    categoryId: category._id,
  })
  const isLoadingTransactions = transactions === undefined

  const transactionCount = transactions?.length ?? 0

  const transactionAmount =
    transactions?.reduce((acc, t) => t.amount + acc, 0) ?? 0
  const amountInDollars = transactionAmount / 100

  const { color, name, icon, is_vendor, type } = category
  const canDeleteCategory = !is_vendor

  const categoryTypeColor = (
    type === "expense" ? "red" : "green"
  ) satisfies Colors

  return (
    <div
      className="mx-auto flex w-full max-w-75 flex-col items-center pb-4"
      style={{ "--item-color": colorToCSSVar(color) } as React.CSSProperties}
    >
      <Emoji className="inline-grid size-17 place-content-center rounded-full bg-(--item-color)/(--fill-quaternary-opacity) text-[2rem]">
        {icon}
      </Emoji>

      <Spacer className="h-2" />

      <p className="max-w-full truncate text-ellipsis font-semibold text-[1.625rem] capitalize leading-tight">
        {name}
      </p>

      <Spacer className="h-4" />

      <div className="space-x-1 capitalize">
        <Pill
          className="**:dark:mix-blend-plus-lighter"
          color={categoryTypeColor}
        >
          <TransactionTypeIcon size={20} type={type} />
          <span>{type}</span>
        </Pill>
        <Pill color={color}>
          <MdInvertColors size={18} />
          {color}
        </Pill>
      </div>

      <Spacer className="h-4" />

      <CategoryStats
        amount={amountInDollars}
        isLoading={isLoadingTransactions}
        transactionCount={transactionCount}
        type={type}
      />

      <Spacer className="h-4" />

      <section className="flex w-full flex-row-reverse gap-1 [&>button]:flex-1">
        <Button color="gray" onPress={onEdit}>
          Edit
        </Button>
        {canDeleteCategory && (
          <Button
            className="dark:mix-blend-plus-lighter"
            color="red"
            onPress={onDelete}
            variant="tinted"
          >
            <BiTrash /> Delete
          </Button>
        )}
      </section>

      {!canDeleteCategory && (
        <>
          <Spacer className="h-2" />
          <DeleteInfo />
        </>
      )}
    </div>
  )
}

/** @todo Extract this component to standalone component */
const Pill = ({
  className,
  color,
  ...rest
}: React.ComponentProps<typeof ark.span> & {
  color?: Colors
}) => {
  // CAUTION: Colors don't look good for "gray"
  const pillColor = color ?? ("gray" satisfies Colors)

  return (
    <ark.span
      className={cn(
        "no-drag inline-flex h-8 items-center gap-0.75 rounded-full bg-(--pill-color)/(--fill-quaternary-opacity) p-2 font-medium text-(--pill-color) leading-none **:leading-none",
        className
      )}
      style={
        { "--pill-color": colorToCSSVar(pillColor) } as React.CSSProperties
      }
      {...rest}
    />
  )
}

const DeleteInfo = () => {
  return (
    <div className="-mb-0.75 flex w-full items-center justify-center gap-1">
      <LuShieldAlert aria-hidden className="text-[0.9em] text-ios-orange" />
      <p className="text-center text-label-tertiary text-sm tracking-wide">
        Built-in categories can’t be deleted.
      </p>
    </div>
  )
}
