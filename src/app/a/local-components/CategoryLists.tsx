"use client"

import { api } from "#/convex/_generated/api"
import { useQuery } from "convex/react"

import { cn } from "@/lib/utils"

export default function TaskLists() {
  const tasks = useQuery(api.tasks.get)

  if (!tasks || tasks.length === 0) return <p>No tasks found!</p>

  return (
    <section className="flex h-fit gap-1">
      <ul className="bg-fill-quaternary flex flex-col rounded-lg p-1">
        {tasks.map(task => {
          const { _id: id, text } = task
          return (
            <li
              className="hover:bg-fill-secondary relative flex items-start gap-2 overflow-hidden rounded px-2 py-1 text-sm font-medium select-none"
              key={id}
            >
              <span>{text}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
