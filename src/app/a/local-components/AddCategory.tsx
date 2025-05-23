"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { api } from "#/convex/_generated/api"
import { Id } from "#/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { v4 as uuidv4 } from "uuid"

import { cn } from "@/lib/utils"

export default function AddCategory() {
  const { userId: ownerId } = useAuth()

  const createCategory = useMutation(
    api.categories.create
  ).withOptimisticUpdate((localStore, { name }) => {
    const existingCategories = localStore.getQuery(api.categories.get, {})

    if (!!existingCategories && !!ownerId) {
      // Manually creating new category
      const newCategory = {
        _id: uuidv4() as Id<"categories">,
        _creationTime: Date.now(),
        name,
        ownerId,
      }

      localStore.setQuery(api.categories.get, {}, [
        ...existingCategories,
        newCategory,
      ])
    }
  })

  const [inputValue, setInputValue] = useState("")
  const clearInput = () => setInputValue("")

  const handleSubmitTask = (): void => {
    const name = inputValue
    if (name.length === 0) return

    createCategory({ name })
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
