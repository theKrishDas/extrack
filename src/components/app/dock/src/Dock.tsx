"use client"

import {useState} from "react"

import {Material} from "@/components/material/material"

import Fab from "./Fab"
import Island from "./Island"

const Dock = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="fixed inset-x-0 bottom-4 z-40 flex items-center justify-center gap-1">
        <Material
          as="section"
          thickness="chrome"
          className="w-fit rounded-full p-1"
          withBorder
        >
          <Island open={open} setOpen={setOpen} />
        </Material>

        <Fab open={open} setOpen={setOpen} />
      </nav>
    </>
  )
}

export {Dock}
