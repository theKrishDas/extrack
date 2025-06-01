"use client"

import {useState} from "react"

import Fab from "./Fab"
import Island from "./Island"

const Dock = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="fixed inset-x-0 bottom-1.5 z-40 flex items-center justify-center gap-1 pb-6">
        <Island open={open} setOpen={setOpen} />
        <Fab open={open} setOpen={setOpen} />
      </nav>
    </>
  )
}

export {Dock}
