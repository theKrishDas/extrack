"use client"

import { api } from "#/convex/_generated/api"
import { useQuery } from "convex/react"

export default function TaskLists() {
  const categories = useQuery(api.categories.get)

  if (!categories || categories.length === 0) return <p>No categories found!</p>

  return (
    <section className="flex h-fit gap-1">
      <ul className="bg-fill-quaternary flex flex-col rounded-lg p-1">
        {categories.map(category => {
          const { _id: id, name } = category
          return (
            <li
              className="hover:bg-fill-secondary relative flex items-start gap-2 overflow-hidden rounded px-2 py-1 text-sm font-medium select-none"
              key={id}
            >
              <span>{name}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
