import fs from "node:fs"
import path from "node:path"
import type { NextConfig } from "next"

const pkg = JSON.parse(fs.readFileSync(path.resolve("./package.json"), "utf8"))
const buildTime = new Date().toISOString()
const commit_sha = process.env.VERCEL_GIT_COMMIT_SHA ?? "dev"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.*"],
  devIndicators: { position: "top-right" },
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    NEXT_PUBLIC_GIT_SHA: commit_sha,
    NEXT_PUBLIC_BUILD_TIME: buildTime,
  },
}

export default nextConfig
