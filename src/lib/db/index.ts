import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Create the Neon SQL client
const sql = neon(process.env.DATABASE_URL!);

// Create the Drizzle ORM instance with our schema
export const db = drizzle(sql, { schema });

export type DB = typeof db;
