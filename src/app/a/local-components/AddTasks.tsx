"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { api } from "#/convex/_generated/api"
import { Doc, Id } from "#/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { v4 as uuidv4 } from "uuid"

import { cn } from "@/lib/utils"

export default function AddTasks() {
  const { userId: ownerId } = useAuth()
  const categories = useQuery(api.categories.get)
  const createTasks = useMutation(api.tasks.create).withOptimisticUpdate(
    (localStore, { isCompleted, category, text }) => {
      const existingTasks = localStore.getQuery(api.tasks.get, {})

      if (!!existingTasks && !!ownerId) {
        const newTask: Doc<"tasks"> = {
          _id: uuidv4() as Id<"tasks">,
          _creationTime: Date.now(),
          ownerId,
          isCompleted,
          category,
          text,
        }

        localStore.setQuery(api.tasks.get, {}, [...existingTasks, newTask])
      }
    }
  )

  const [inputValue, setInputValue] = useState("")
  const clearInput = () => setInputValue("")

  const [selectedCategory, setSelectedCategory] = useState<
    Id<"categories"> | undefined
  >()
  const clearSelectedCategory = () => setSelectedCategory(undefined)

  const handleSubmitTask = (): void => {
    const text = inputValue
    if (text.length === 0) return

    createTasks({ text, isCompleted: false, category: selectedCategory })
    clearInput()
    clearSelectedCategory()
    return
  }

  return (
    <>
      <div className="relative h-fit w-full">
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
          onClick={handleSubmitTask}
        >
          ⨯
        </button>
      </div>

      {categories && (
        <div className="relative mt-1 flex h-fit w-full gap-1 px-1">
          {categories.map(({ _id, name }) => (
            <button
              className={cn(
                "text-label-secondary bg-fill-tertiary rounded-md px-[0.2rem] py-0.5 text-xs",
                _id === selectedCategory && "bg-ios-blue text-white"
              )}
              key={_id}
              onClick={() =>
                setSelectedCategory(c => {
                  if (_id === c) return undefined
                  if (_id !== c) return _id
                })
              }
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
