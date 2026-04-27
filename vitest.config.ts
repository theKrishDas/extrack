/// <reference types="vitest/config" />
import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "edge-runtime",
    server: { deps: { inline: ["convex-test"] } },
  },
  resolve: {
    alias: {
      "#lib": path.resolve(import.meta.dirname, "./lib"),
      "#/convex": path.resolve(import.meta.dirname, "./convex"),
    },
  },
})
