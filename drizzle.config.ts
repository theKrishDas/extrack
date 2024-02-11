import { Config } from "drizzle-kit";

export default {
  // schema: "./db/schema/*",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DRIZZLE_DATABASE_URL || "",
  },
  strict: true,
  verbose: true,
  out: "./db/drizzle",
} satisfies Config;
