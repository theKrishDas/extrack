"use client"

import {Drawer} from "vaul"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button/animated-button"

export default function ChildComponent() {
  return (
    <Drawer.Root shouldScaleBackground setBackgroundColorOnScale={false}>
      <Drawer.Trigger asChild>
        <Button className="backdrop-blur-md" color="gray">
          + Add
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="bg-background/60 fixed inset-0" />
        <Drawer.Content className="fixed right-0 bottom-1.5 left-0 h-fit px-1.5 outline-none [--initial-transform:calc(100%+0.375rem)]">
          <Drawer.Title className="sr-only" />
          <div
            className={cn(
              "rounded-2xl p-4 before:rounded-2xl",
              // Material
              "bg-fill-quaternary shadow-[inset_0_1px,inset_0_0_0_1px] shadow-white/[0.025] backdrop-blur-2xl"
            )}
          >
            <Drawer.Handle />
            <div className="inline-flex h-32 w-full items-center">
              <p className="text-xl font-bold">Are you sure?</p>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
