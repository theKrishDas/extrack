import { useMutation } from "convex/react"
import type { FunctionReturnType } from "convex/server"
import { format } from "date-fns"
import { Drawer } from "vaul"
import { api } from "#/convex/_generated/api"
import { DataTable, type DataType } from "@/app/(index)/local-comps/DataTable"
import { Button as AnimatedButton } from "@/components/ui/button/animated-button"
import { ConfirmButton } from "@/components/ui/confirm-button"
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter"
import { cn } from "@/lib/utils"

function Comp({
  txn,
  onClose,
  open,
  onOpenChange,
}: {
  txn:
    | FunctionReturnType<
        typeof api.transactions.getJoinedPaginated
      >["page"][number]
    | null
  onClose?: () => void
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const formatter = useCurrencyFormatter()
  const removeTransaction = useMutation(api.transactions.remove)

  if (!txn) return

  const {
    amount,
    date,
    note,
    category: { name: catName },
    account: { name: accName },
  } = txn

  const data: DataType = {
    header: ["Key", "value"],
    body: [
      ["Amount", formatter.format(amount)],
      ["Date", format(date, "dd MMM 'at' hh:mm a")],
      ["Category", catName],
      ["Account", accName],
      ["Note", note],
    ],
  }

  return (
    <Drawer.Root onClose={onClose} onOpenChange={onOpenChange} open={open}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/30" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto mt-24 flex h-auto max-w-xl flex-col rounded-t-xl bg-background-tertiary p-4 pt-0 outline-none">
          <Drawer.Handle className="my-2" />
          <Drawer.Title className="flex items-center justify-start gap-0.5 font-bold text-2xl">
            <span
              aria-hidden={true}
              className={cn(
                "font-rnx-rounded text-[0.9em]",
                txn.type === "expense" ? "text-ios-red" : "text-ios-green"
              )}
            >
              {txn.type === "expense" ? "􀁹" : "􀁷"}
            </span>

            {txn.type === "expense" ? "Expense" : "Income"}
          </Drawer.Title>

          <DataTable
            ariaLabel="Transaction details"
            className="mt-5"
            data={data}
          />

          <div className="flex flex-row-reverse gap-2">
            <AnimatedButton className="flex-1" color="gray" isDisabled>
              Edit
            </AnimatedButton>
            <ConfirmButton
              className="flex-1"
              onConfirm={() => {
                onOpenChange(false)
                removeTransaction({ id: txn._id })
              }}
              restVariants={{ color: "gray" }}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export { Comp as Drawer }
