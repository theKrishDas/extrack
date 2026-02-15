# Clerk → Convex HTTP Webhook

This endpoint verifies Clerk webhooks with Svix and logs events. It is a Convex HTTP endpoint, not a Next.js API route.

- Send requests to your Convex URL (`.convex.site`), not your Next.js app
- Set secrets in Convex, not in your Next.js env
- Route in this repo: `/clerk-users-webhook` (see `convex/http.ts`)

## Endpoint URL

- `https://<deployment>.convex.site/clerk-users-webhook`
- Find `<deployment>.convex.site` in Convex dashboard → Settings → HTTP Actions URL

## Setup

1. Start Convex

- `npx convex dev`

2. Create a Clerk webhook endpoint

- Clerk Dashboard → Webhooks → Add Endpoint
- Endpoint URL: `https://<deployment>.convex.site/clerk-users-webhook`
- Select events (e.g., `user.created` or all user events)
- Create endpoint and copy the Signing Secret (`whsec_…`)

3. Set the signing secret in Convex (not in your Next.js app)

- `bun convex env set CLERK_WEBHOOK_SIGNING_SECRET whsec_XXXX`
- Or Convex Dashboard → Deployment Settings → Environment Variables
- Restart `npx convex dev` if prompted

## Test

- Clerk → Webhooks → Send test event (e.g., `user.created`) or sign up a new user
- Check logs in Convex dashboard or your terminal
- Expected: `200 OK` and a log like:
  - `Clerk webhook received: { type: 'user.created', userId: 'user_...' }`

## Debug

- URL uses `.convex.site` and ends with `/clerk-users-webhook`
- Function appears under Functions → `http` in Convex dashboard
- `CLERK_WEBHOOK_SIGNING_SECRET` is set correctly
- Clerk delivery shows successful attempts

## Reference

- Implementation: `convex/http.ts`
