Here's a concise, complete example for unit testing a Convex migration with Vitest:

```ts
import { test, expect } from "vitest";
import { convexTest } from "convex-test";
import component from "@convex-dev/migrations/test";
import { runToCompletion } from "@convex-dev/migrations";
import { components, internal } from "./_generated/api";
import schema from "./schema";

test("test setDefaultValue migration", async () => {
  const t = convexTest(schema);
  // Register the migrations component in the test instance
  component.register(t);

  await t.run(async (ctx) => {
    // Insert sample data to migrate
    await ctx.db.insert("myTable", { optionalField: undefined });

    // Run the migration to completion
    const migrationToTest = internal.example.setDefaultValue;
    await runToCompletion(ctx, components.migrations, migrationToTest);

    // Assert the migration worked
    const docs = await ctx.db.query("myTable").collect();
    expect(docs.every((doc) => doc.optionalField !== undefined)).toBe(true);
  });
});
```

Key points:

1. **Register the component** — call `component.register(t)` after initializing `convexTest` so the migrations component is available in the test environment.
2. **Use `runToCompletion`** — this runs the migration synchronously within the test action context, rather than asynchronously in the background.
3. **Seed data before, assert after** — insert documents representing the "before" state, run the migration, then verify the "after" state.

[[Testing migrations](https://www.convex.dev/components/migrations#running-migrations-synchronously)]
