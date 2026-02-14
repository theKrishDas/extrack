function getBaseURL(): string {
  const url = process.env.NEXT_PUBLIC_URL
  if (!url)
    throw new Error("Missing NEXT_PUBLIC_URL. Define it in your .env file.")
  return url
}

export const baseURL = getBaseURL()
