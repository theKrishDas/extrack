"use client"

import {useState} from "react"

import {Material} from "@/components/material/material"

import Fab from "./Fab"
import Island from "./Island"

const Dock = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="fixed inset-x-0 bottom-4 z-40">
        <Material
          as="section"
          className="mx-auto flex w-fit items-center justify-center gap-1 rounded-full p-1"
          withBorder
        >
          <Island open={open} setOpen={setOpen} />
          <Fab open={open} setOpen={setOpen} />
        </Material>
      </nav>
    </>
  )
}

export {Dock}
