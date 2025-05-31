"use client"

import {useState} from "react"
import {Popover} from "@ark-ui/react/popover"
import {AnimatePresence, motion, Transition} from "motion/react"
import useMeasure from "react-use-measure"

import {TTransactionType} from "@/lib/schema/new-transaction-schema"
import {Button} from "@/components/ui/button/animated-button"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {IonArrowDown, IonArrowUp, IonPlusRound} from "@/components/icons/ion"
import InputComponent from "@/app/(index)/local-comps/InputComponent"

const Dock = () => {
  const [ref, {width}] = useMeasure()
  const [open, setOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const offset = 5
  const physics: Transition = {
    type: "spring",
    stiffness: 300,
    damping: 20,
  }

  // Will implement later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleButtonClick = (type: TTransactionType): void => {
    setOpen(false)
    setDrawerOpen(true)
  }

  return (
    <>
      <nav className="fixed inset-x-0 bottom-1.5 z-40 flex items-center justify-center gap-1 pb-6">
        <motion.div
          className="pointer-events-none overflow-hidden rounded-full"
          animate={{width: width || "auto"}}
          transition={physics}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={open ? "open" : "close"}
              className="h-auto w-auto"
              animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
              initial={{opacity: 0, y: offset * -1, filter: "blur(12px)"}}
              exit={{opacity: 0, y: offset * 1, filter: "blur(12px)"}}
            >
              <div className="inline-flex w-fit items-center gap-1" ref={ref}>
                {!open ? (
                  // *
                  // Dock content when idle.
                  // *
                  <Button color="gray">Home</Button>
                ) : (
                  // *
                  // Renders "Income" and "Expense" buttons for transaction type selection when the menu is open.
                  // *
                  <Popover.Root open={open} onOpenChange={v => setOpen(v.open)}>
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
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/*
         * Add transaction button
         */}
        <Button
          color="gray"
          isIconOnly
          onPress={() => setOpen(v => !v)}
          className="h-12 w-12" // match the size with the other buttons
        >
          <motion.span
            animate={open ? {rotate: 45} : {rotate: 0}}
            transition={physics}
          >
            <IonPlusRound />
          </motion.span>
        </Button>
      </nav>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="sr-only">
            <DrawerTitle>Add a new transaction.</DrawerTitle>
            <DrawerDescription>
              Fill up this form to add new transaction.
            </DrawerDescription>
          </DrawerHeader>

          <DrawerBody>
            <InputComponent afterSubmit={() => setOpen(false)} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export {Dock}
