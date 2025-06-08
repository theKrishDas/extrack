import {Dispatch, SetStateAction} from "react"
import {api} from "#/convex/_generated/api"
import {useMutation, useQuery} from "convex/react"

import {Transaction} from "@/lib/types/transactions"
import {formatDate} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {ConfirmButton} from "@/components/ui/confirm-button"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHandle,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

import {DataTable, DataType} from "./DataTable"

export default function ExpantionDrawer({
  open,
  setOpen,
  transaction,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  transaction: Transaction
}) {
  const removeTransaction = useMutation(api.transactions.remove)
  const {
    amount,
    note,
    _creationTime,
    _id: id,
    category: categoryId,
    account: accountId,
  } = transaction
  const category = useQuery(api.categories.getById, {id: categoryId})
  const account = useQuery(api.accounts.getById, {id: accountId})

  const data: DataType = {
    header: ["Key", "value"],
    body: [
      ["Amount", amount],
      ["Date", formatDate(_creationTime)],
      ["Category", category?.name],
      ["Account", account?.name],
      ["Note", note],
    ],
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
      <DrawerContent>
        <DrawerHandle className="mt-4" />

        <DrawerHeader className="pb-5 text-left">
          <DrawerTitle className="text-2xl font-bold">Transaction</DrawerTitle>
        </DrawerHeader>

        <DrawerBody className="py-0">
          <DataTable data={data} ariaLabel="Transaction details" />
        </DrawerBody>

        <DrawerFooter>
          <Button className="flex-1" color="gray" isDisabled>
            Edit
          </Button>
          <ConfirmButton
            className="flex-1"
            restVariants={{color: "gray"}}
            onConfirm={() => {
              setOpen(false)
              removeTransaction({id})
            }}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
