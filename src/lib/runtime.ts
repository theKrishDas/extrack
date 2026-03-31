function getBaseURL(): string {
  const url = process.env.NEXT_PUBLIC_URL
  if (!url)
    throw new Error("Missing NEXT_PUBLIC_URL. Define it in your .env file.")
  return url
}

export const BUILD_METADATA = {
  version: process.env.NEXT_PUBLIC_APP_VERSION || "0.0.0",
  commitHash: process.env.NEXT_PUBLIC_COMMIT_HASH || "unknown",
}

export const baseURL = getBaseURL()
