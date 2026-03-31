import { useMutation } from "convex/react"
import { useQuery } from "convex-helpers/react/cache/hooks"
import { format } from "date-fns"
import type { Dispatch, SetStateAction } from "react"
import { api } from "#/convex/_generated/api"
import type { Doc } from "#/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { ConfirmButton } from "@/components/ui/confirm-button"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHandle,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { DataTable, type DataType } from "./DataTable"

export default function ExpantionDrawer({
  open,
  setOpen,
  transaction,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  transaction: Doc<"transactions">
}) {
  const removeTransaction = useMutation(api.transaction.delete)
  const {
    amount,
    note,
    _creationTime,
    _id: id,
    category: categoryId,
    account: accountId,
  } = transaction
  const category = useQuery(api.category.get, { id: categoryId })
  const account = useQuery(api.account.get, { id: accountId })

  const data: DataType = {
    header: ["Key", "value"],
    body: [
      ["Amount", amount],
      ["Date", format(_creationTime, "dd MMM 'at' hh:mm a")],
      ["Category", category?.name],
      ["Account", account?.name],
      ["Note", note],
    ],
  }

  return (
    <Drawer onOpenChange={setOpen} open={open} shouldScaleBackground={false}>
      <DrawerContent>
        <DrawerHandle className="mt-4" />

        <DrawerHeader className="pb-5 text-left">
          <DrawerTitle className="font-bold text-2xl">Transaction</DrawerTitle>
        </DrawerHeader>

        <DrawerBody className="py-0">
          <DataTable ariaLabel="Transaction details" data={data} />
        </DrawerBody>

        <DrawerFooter>
          <Button className="flex-1" color="gray" isDisabled>
            Edit
          </Button>
          <ConfirmButton
            className="flex-1"
            onConfirm={() => {
              setOpen(false)
              removeTransaction({ id })
            }}
            restVariants={{ color: "gray" }}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
