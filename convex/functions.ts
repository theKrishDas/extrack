// biome-ignore lint/performance/noNamespaceImport: centralized export surface for Convex helpers
import * as server from "./_generated/server"

export const action = server.action
export const internalAction = server.internalAction
export const internalMutation = server.internalMutation
export const internalQuery = server.internalQuery
export const mutation = server.mutation
export const query = server.query
