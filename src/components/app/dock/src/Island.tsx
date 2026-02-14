import { Popover } from "@ark-ui/react/popover"
import { type Dispatch, type SetStateAction, useState } from "react"
import {
  Form,
  Provider as FormProvider,
} from "@/components/form/transaction/new-v2"
import { IonArrowDown, IonArrowUp } from "@/components/icons/ion/arrow"
import { AnimatedContainer } from "@/components/ui/animated-container"
import { Button } from "@/components/ui/button/animated-button"
import { Drawer } from "@/components/ui/drawer/drawer-v2"
import type { TTransactionType } from "@/lib/schema/transactions"

import { physics } from "./helpers"
import IdleNav from "./Idle"

export default function Island({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<
    TTransactionType | undefined
  >(undefined)

  const offset = 5

  const handleButtonClick = (type: TTransactionType): void => {
    setTransactionType(type)
    setOpen(false)
    setDrawerOpen(true)
  }

  return (
    <>
      <AnimatedContainer.Root
        animate="width"
        className="rounded-full"
        transition={physics}
      >
        <AnimatedContainer.Content
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          animationKey={open ? "open" : "close"}
          exit={{ opacity: 0, y: offset * 1, filter: "blur(12px)" }}
          initial={{ opacity: 0, y: offset * -1, filter: "blur(12px)" }}
        >
          {open ? (
            // *
            // Renders "Income" and "Expense" buttons for transaction type
            // selection when the menu is open.
            // *
            <Popover.Root
              lazyMount
              onOpenChange={(v) => setOpen(v.open)}
              open={open}
              unmountOnExit
            >
              <Popover.Content className="inline-flex gap-1">
                <Popover.Title className="sr-only">Title</Popover.Title>
                <Popover.Description className="sr-only">
                  Description
                </Popover.Description>
                <Button
                  color="gray"
                  onPress={() => {
                    handleButtonClick("income")
                  }}
                >
                  <IonArrowUp />
                  Income
                </Button>
                <Button
                  color="gray"
                  onPress={() => {
                    handleButtonClick("expense")
                  }}
                >
                  <IonArrowDown />
                  Expense
                </Button>
              </Popover.Content>
            </Popover.Root>
          ) : (
            // *
            // Dock content when idle.
            // *
            <IdleNav />
          )}
        </AnimatedContainer.Content>
      </AnimatedContainer.Root>

      {transactionType && (
        <Drawer.Root
          onOpenChange={setDrawerOpen}
          open={drawerOpen}
          showHandle
          useBlur
        >
          <Drawer.Content>
            <Drawer.Header className="h-8">
              <Drawer.Title srOnly>New {transactionType}</Drawer.Title>
            </Drawer.Header>

            <FormProvider
              afterSubmit={() => setDrawerOpen(false)}
              type={transactionType}
            >
              <Form />
            </FormProvider>
          </Drawer.Content>
        </Drawer.Root>
      )}
    </>
  )
}
