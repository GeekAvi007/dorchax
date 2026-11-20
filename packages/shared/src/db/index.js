import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://dorchax:secretpassword@127.0.0.1:5433/dorchax_db";

export const pgClient = postgres(connectionString);
export const db = drizzle(pgClient, { schema });
export * from "./schema.js";
