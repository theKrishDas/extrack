# Extrack

Extrack is a personal finance tracker built with Next.js, TypeScript, Tailwind,
and Convex.

## Cloning:

### Clone Extrack:

```sh
git clone https://github.com/thekrishdas/extrack.git
```

### or Clone in current directory:

```sh
git clone https://github.com/thekrishdas/extrack.git .
```

### or Clone single branch in current directory:

```sh
git clone --single-branch https://github.com/thekrishdas/extrack.git .
```

### or Clone in a pre-existing repository (detached HEAD):

1. Fetch the remote branch:
   ```sh
   git fetch https://github.com/thekrishdas/extrack.git main
   ```
2. Create and checkout a new branch:
   ```sh
   git checkout -b extrack-main FETCH_HEAD
   ```

---

## Running locally

```sh
bun run dev
```

### Notes:

This branch does not use any UI-library of any kind and serves as a clean
starting point.

1. Package versions

- Next 15
- React 19
- Tailwind 4

2. Formatting

- @ianvs/prettier-plugin-sort-imports
- prettier-plugin-tailwindcss

## Webhooks

- Clerk webhooks target your Convex URL, not your Next.js app.
- Guide: see `convex/HTTP_README.md`.
- Endpoint format: `https://<deployment>.convex.site/clerk-users-webhook`.
- Set secret in Convex (not Next.js):
  - `bun convex env set CLERK_WEBHOOK_SIGNING_SECRET whsec_XXXX`
