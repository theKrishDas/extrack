import {Dispatch, SetStateAction, useState} from "react"
import {Popover} from "@ark-ui/react/popover"

import {TTransactionType} from "@/lib/schema/new-transaction-schema"
import {AnimatedContainer} from "@/components/ui/animated-container"
import {Button} from "@/components/ui/button/animated-button"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {IonArrowDown, IonArrowUp} from "@/components/icons/ion/arrow"
import InputComponent from "@/app/(index)/local-comps/InputComponent"

import {physics} from "./helpers"

export default function Island({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const offset = 5

  // Will implement later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleButtonClick = (type: TTransactionType): void => {
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
            <Button color="gray">Home</Button>
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

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="sr-only">
            <DrawerTitle>Add a new transaction.</DrawerTitle>
            <DrawerDescription>
              Fill up this form to add new transaction.
            </DrawerDescription>
          </DrawerHeader>

          <DrawerBody>
            <InputComponent afterSubmit={() => setDrawerOpen(false)} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
