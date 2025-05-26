import {Dispatch, SetStateAction} from "react"

import {Transaction} from "@/lib/types/transactions"
import {Button} from "@/components/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

export default function ExpantionDrawer({
  open,
  setOpen,
  transaction,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  transaction: Transaction
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHandle className="mt-4" />

        <DrawerHeader className="sr-only">
          <DrawerTitle>Transaction details</DrawerTitle>
        </DrawerHeader>

        <DrawerBody className="pb-0">
          <pre className="bg-fill-quaternary w-full overflow-auto rounded-lg p-4">
            {JSON.stringify(transaction, null, 2)}
          </pre>
        </DrawerBody>

        <DrawerFooter>
          <Button className="flex-1" color="gray" isDisabled>
            Edit
          </Button>
          <Button color="red" variant="tinted" className="flex-1">
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
