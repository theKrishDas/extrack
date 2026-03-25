# Agent Notes

Stack: Next.js + Convex. Formatting and linting: Ultracite (Biome).

## Goals

Write code that is accessible, fast, type-safe, and easy to maintain. Prefer clear intent over clever tricks.

## Commands (bun only)

- Use `bun` and `bunx` for scripts and CLIs.
- Do not use `npm`, `npx`, `pnpm`, or `yarn` in docs, scripts, or instructions.
- Ultracite
  - `bun x ultracite fix`
  - `bun x ultracite check`
  - `bun x ultracite doctor`

## Styling and colors (Tailwind v4 + CSS variables)

- Tokens must come from `src/css/colors/colors.css`.
- Prefer token-based Tailwind utilities (example `text-ios-blue`). Use `var(--ios-blue)` when needed.
- Do not use Tailwind palette classes like `text-blue-500` or `bg-slate-900`.
- Do not import `tailwindcss/colors`.

## Convex

- Prefer `userQuery` and `userMutation`.
- Import helpers from `convex/functions.ts`.

## TypeScript

- Add explicit types when they make intent clearer.
- Use `unknown` instead of `any` when the type is not known.
- Use `as const` for immutable values and literal types.
- Prefer narrowing over type assertions.
- Avoid magic numbers. Use named constants.

## JavaScript

- Prefer arrow functions for callbacks and small helpers.
- Prefer `for...of` over `.forEach()` and indexed `for`.
- Use `?.` and `??` for safer access and defaults.
- Prefer template literals over string concat.
- Prefer destructuring.
- Default to `const`. Use `let` only when needed. Never use `var`.

## Async

- Always `await` promises when you need their result.
- Prefer `async/await` over promise chains.
- Handle errors with real `try/catch` blocks when needed.
- Do not use `async` functions as `new Promise` executors.

## React

- Use function components.
- Call hooks only at the top level.
- Keep hook deps correct.
- Use stable keys. Prefer IDs over array indexes.
- Put children between tags, not in props.
- Do not define components inside other components.
- Use semantic HTML and ARIA
  - Meaningful image alt text
  - Correct heading order
  - Labels for inputs
  - Keyboard support for interactive UI
  - Use `<button>`, `<nav>`, etc, not `div` with roles

## Errors

- Remove `console.log`, `debugger`, and `alert`.
- Throw `Error` objects with helpful messages.
- Do not catch just to rethrow.
- Prefer early returns over deep nesting.

## Structure

- Keep functions small and focused.
- Extract complex conditions into named booleans.
- Avoid nested ternaries.
- Group related code. Separate concerns.

## Security

- Add `rel="noopener"` on `target="_blank"` links.
- Avoid `dangerouslySetInnerHTML` unless required.
- Do not use `eval()` or write `document.cookie` directly.
- Validate and sanitize input.

## Performance

- Avoid spread in accumulators in loops.
- Use regex literals, not regex created inside loops.
- Prefer specific imports over namespace imports.
- Avoid barrel files that re-export everything.
- Use Next.js `<Image>` instead of `<img>`.

## Next.js

- Use `<Image>` for images.
- Use `next/head` or App Router metadata for head tags.
- Prefer Server Components for async data fetching.

## React 19+

- Pass `ref` as a prop. Do not use `React.forwardRef`.

## Testing

- Put assertions inside `it()` or `test()`.
- Avoid `done`. Use async tests.
- Do not commit `.only` or `.skip`.
- Keep suites flat. Avoid deep `describe` nesting.

## Notes

Ultracite fixes most formatting and lint issues. Run `bun x ultracite fix` before you commit.
