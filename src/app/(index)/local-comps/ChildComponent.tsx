"use client"

import {useState} from "react"
import {Drawer} from "vaul"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button/animated-button"

import InputComponent from "./InputComponent"

export default function ChildComponent() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Drawer.Root
      shouldScaleBackground
      setBackgroundColorOnScale={false}
      open={open}
      onOpenChange={setOpen}
    >
      <Drawer.Trigger asChild>
        <Button className="backdrop-blur-md" color="gray">
          + Add
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="bg-background/60 fixed inset-0" />
        <Drawer.Content className="fixed right-0 bottom-1.5 left-0 h-fit px-1.5 outline-none [--initial-transform:calc(100%+0.375rem)]">
          <Drawer.Title className="sr-only">Add new transaction</Drawer.Title>
          <div
            className={cn(
              "rounded-2xl p-4 before:rounded-2xl",
              // Material
              "bg-fill-quaternary shadow-[inset_0_1px,inset_0_0_0_1px] shadow-white/[0.025] backdrop-blur-2xl"
            )}
          >
            <InputComponent setOpen={setOpen} />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
