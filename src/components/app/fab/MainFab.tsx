"use client"

import {useState} from "react"

import {Button} from "@/components/ui/button/animated-button"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {IonPlusRound} from "@/components/icons/ion"
import InputComponent from "@/app/(index)/local-comps/InputComponent"

export default function Fab() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="tinted" color="blue" size="lg" isIconOnly>
          <IonPlusRound />
          {/* <IonAdd /> */}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>Add a new transaction.</DrawerTitle>
          <DrawerDescription>
            Fill up this form to add new transaction.
          </DrawerDescription>
        </DrawerHeader>

        <DrawerBody>
          <InputComponent setOpen={setOpen} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
