"use client"

import { type Preloaded, useConvexAuth, usePreloadedQuery } from "convex/react"
import type { FunctionReference } from "convex/server"
import { createContext, type ReactNode, use, useEffect, useState } from "react"

export function createPreloadedQueryContext<
  Query extends FunctionReference<"query">,
>() {
  type Data = ReturnType<typeof usePreloadedQuery<Query>>

  const Context = createContext<Data | null>(null)

  function Provider(props: {
    preloaded: Preloaded<Query>
    children: ReactNode
  }) {
    const { isLoading } = useConvexAuth()
    const liveData = usePreloadedQuery(props.preloaded)
    const [data, setData] = useState(liveData)

    // hold the preloaded result to prevent Auth Race Condition
    useEffect(() => {
      if (!isLoading) setData(liveData)
    }, [isLoading, liveData])

    return <Context value={data}>{props.children}</Context>
  }

  function useData(hookName = "useData") {
    const ctx = use(Context)
    if (ctx === null)
      throw new Error(`${hookName} must be used within its Provider`)
    return ctx
  }

  return { Provider, useData, Context }
}
