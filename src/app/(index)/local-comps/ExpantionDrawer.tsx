import {Dispatch, SetStateAction} from "react"
import {Drawer} from "vaul"

import {Transaction} from "@/lib/types/transactions"
import {Button} from "@/components/ui/button"

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
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="bg-background/60 fixed inset-0" />

        <Drawer.Content className="fixed right-0 bottom-1.5 left-0 h-fit px-1.5 outline-none [--initial-transform:calc(100%+0.375rem)]">
          <Drawer.Title className="sr-only">Transaction details</Drawer.Title>
          <div className="bg-fill-quaternary rounded-2xl p-4 shadow-[inset_0_1px,inset_0_0_0_1px] shadow-white/[0.025] backdrop-blur-2xl before:rounded-2xl">
            {/* Details start from here: */}
            <section className="mx-auto flex w-full max-w-md flex-col items-center gap-2 overflow-hidden">
              <pre className="bg-fill-quaternary max-w-full overflow-auto rounded-lg p-4">
                {JSON.stringify(transaction, null, 2)}
              </pre>
              <div className="flex w-full flex-row-reverse gap-2">
                <Button className="flex-1" color="gray" isDisabled>
                  Edit
                </Button>
                <Button color="red" variant="tinted" className="flex-1">
                  Delete
                </Button>
              </div>
            </section>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
