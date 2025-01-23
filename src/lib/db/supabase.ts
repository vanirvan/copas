import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/db/types";

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY!,
);
