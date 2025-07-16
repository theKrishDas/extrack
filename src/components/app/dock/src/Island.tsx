import {Dispatch, SetStateAction, useState} from "react"
import {Popover} from "@ark-ui/react/popover"

import {TTransactionType} from "@/lib/schema/transactions"
import {AnimatedContainer} from "@/components/ui/animated-container"
import {Button} from "@/components/ui/button/animated-button"
import {Drawer} from "@/components/ui/drawer/drawer-v2"
import {
  Form,
  Provider as FormProvider,
} from "@/components/form/transaction/new-v2"
import {IonArrowDown, IonArrowUp} from "@/components/icons/ion/arrow"

import {physics} from "./helpers"
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
        className="rounded-full"
        transition={physics}
        animate="width"
      >
        <AnimatedContainer.Content
          animationKey={open ? "open" : "close"}
          animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
          initial={{opacity: 0, y: offset * -1, filter: "blur(12px)"}}
          exit={{opacity: 0, y: offset * 1, filter: "blur(12px)"}}
        >
          {!open ? (
            // *
            // Dock content when idle.
            // *
            <IdleNav />
          ) : (
            // *
            // Renders "Income" and "Expense" buttons for transaction type
            // selection when the menu is open.
            // *
            <Popover.Root
              open={open}
              onOpenChange={v => setOpen(v.open)}
              lazyMount
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
          )}
        </AnimatedContainer.Content>
      </AnimatedContainer.Root>

      {transactionType && (
        <Drawer.Root
          showHandle
          useBlur
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
        >
          <FormProvider
            type={transactionType}
            afterSubmit={() => setDrawerOpen(false)}
          >
            <Drawer.Content>
              <Drawer.Header className="h-8">
                <Drawer.Title srOnly>New {transactionType}</Drawer.Title>
              </Drawer.Header>

              <Form />
            </Drawer.Content>
          </FormProvider>
        </Drawer.Root>
      )}
    </>
  )
}
