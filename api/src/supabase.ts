import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types.ts";
import { config } from "dotenv";
config();

export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if(!url || !serviceKey) throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set");

  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}