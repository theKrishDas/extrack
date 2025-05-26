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

import InputComponent from "./InputComponent"

export default function ChildComponent() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="backdrop-blur-md" color="gray">
          + Add
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
