// biome-ignore-all lint/style/noNonNullAssertion: Environment variables are required and checked at runtime by Convex
import type { WebhookEvent } from "@clerk/backend"
import { httpRouter } from "convex/server"
import { Webhook } from "svix"
import { internal } from "./_generated/api"
import { httpAction } from "./_generated/server"

const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request)

  if (!event) {
    console.log("Invalid Clerk webhook")
    return new Response("Error occurred", { status: 400 })
  }

  // Handle user.created event - onboard new users
  if (event.type === "user.created") {
    const userId = event.data.id
    console.log(`Onboarding new user: ${userId}`)

    await ctx.runMutation(internal.userOnboarding.onboardUser, { userId })

    console.log(`User ${userId} onboarded successfully`)
  }

  return new Response("OK", { status: 200 })
})

const http = httpRouter()

// This defines a Convex HTTP endpoint — NOT a Next.js API route.
//
// Important:
// - `path` can technically be anything you choose.
// - Requests sent to this path go to the **Convex deployment URL**, not your Next.js app.
// - Example webhook URL:
//   https://worthy-ammulate-33.convex.site/clerk-users-webhook
//
// Clerk (or any external service) must call the Convex URL above,
// because `httpAction` runs inside Convex's HTTP router.

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
})

/**
 * Validates and verifies an incoming Clerk webhook request using Svix.
 *
 * What this does:
 * - Reads the **raw request body** (required for signature validation).
 * - Extracts Svix headers: id, timestamp, and signature.
 * - Uses CLERK_WEBHOOK_SECRET to cryptographically verify the payload.
 *
 * Why this exists:
 * - Ensures the request actually came from Clerk.
 * - Prevents forged or tampered webhook events.
 *
 * Returns:
 * - Parsed WebhookEvent if verification succeeds.
 * - null if verification fails.
 */
async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text()

  const headers = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET!)

  try {
    return wh.verify(payloadString, headers) as unknown as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook event", err)
    return null
  }
}

export default http
