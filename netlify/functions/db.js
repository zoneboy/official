import { neon } from "@neondatabase/serverless";

export function getDB() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  return neon(process.env.DATABASE_URL);
}

export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

export const json = (data, s = 200) => ({ statusCode: s, headers: { "Content-Type": "application/json", ...CORS }, body: JSON.stringify(data) });
export const err = (msg, s = 500) => json({ error: msg }, s);
