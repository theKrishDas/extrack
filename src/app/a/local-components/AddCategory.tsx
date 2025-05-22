"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

export default function AddCategory() {
  const [inputValue, setInputValue] = useState("")
  const clearInput = () => setInputValue("")

  const handleSubmitTask = (): void => {
    const text = inputValue
    if (text.length === 0) return

    clearInput()
    return
  }

  return (
    <div className="relative h-fit w-full">
      <input
        className={cn(
          "bg-fill-tertiary text-label-secondary w-full rounded-lg text-sm select-none",
          "px-3.5 py-1.75 leading-5",
          "rounded-xl px-5 py-3.5 leading-5.5",
          "focus-visible:ring-ios-blue/50 outline-none focus-visible:ring-4"
        )}
        type="text"
        placeholder="Type name..."
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
      />
      <button
        className="text-label-secondary hover:bg-fill-secondary absolute top-1/2 right-3.5 inline-flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-sm font-medium"
        onClick={handleSubmitTask}
      >
        ⨯
      </button>
    </div>
  )
}
