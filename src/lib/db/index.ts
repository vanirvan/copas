import { drizzle } from "drizzle-orm/neon-http";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is missing");
export const db = drizzle(connectionString);
