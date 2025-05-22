"use client"

import { useState } from "react"
import { api } from "#/convex/_generated/api"
import { useMutation } from "convex/react"

import { cn } from "@/lib/utils"

export default function AddTasks() {
  const [inputValue, setInputValue] = useState("")
  const createTasks = useMutation(api.tasks.create)

  const handleSubmitTask = (): void => {
    const text = inputValue
    if (text.length === 0) return

    createTasks({ text, isCompleted: false })
    return
  }

  return (
    <section className="flex h-fit gap-1">
      <div className="relative h-fit w-full max-w-70">
        <input
          className={cn(
            "bg-fill-tertiary text-label-secondary w-full rounded-lg text-sm select-none",
            "px-3.5 py-1.75 leading-5",
            "rounded-xl px-5 py-3.5 leading-5.5",
            "focus-visible:ring-ios-blue/50 outline-none focus-visible:ring-4"
          )}
          type="text"
          placeholder="Add something here..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <button
          className="text-label-secondary hover:bg-fill-secondary absolute top-1/2 right-3.5 inline-flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-sm font-medium"
          onClick={() => setInputValue("")}
        >
          ⨯
        </button>
      </div>

      <button
        type="submit"
        className="text-label-secondary bg-fill-tertiary inline-flex items-center justify-center rounded-xl px-4 text-sm font-medium"
        onClick={handleSubmitTask}
      >
        Add todo
      </button>
    </section>
  )
}
