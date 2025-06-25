
import { createClient } from '@supabase/supabase-js';
import { Database } from './supabaseTypes'; // Will be generated later if you use Supabase CLI type generation

const env = (import.meta as any).env;

console.log("[DEBUG] SupabaseClient: import.meta.env object:", env);

if (!env) {
  throw new Error(
    "Vite environment variables (import.meta.env) are not available. " +
    "This can happen if the app is not run through Vite (e.g., 'npm run dev') " +
    "or if there's a build configuration issue. " +
    "Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file at the project root."
  );
}

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

console.log("[DEBUG] SupabaseClient: VITE_SUPABASE_URL:", supabaseUrl);
console.log("[DEBUG] SupabaseClient: VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}... (truncated)` : undefined);


if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL (VITE_SUPABASE_URL) and/or Anon Key (VITE_SUPABASE_ANON_KEY) " +
    "are missing from your environment variables. " +
    "Please check your .env file or build configuration. Values received: URL=" + supabaseUrl + ", Key available=" + (!!supabaseAnonKey)
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Note: For advanced type safety, you can generate types from your Supabase schema:
// 1. Install Supabase CLI: npm install supabase --save-dev
// 2. Login: npx supabase login
// 3. Link project: npx supabase link --project-ref YOUR_PROJECT_ID
// 4. Generate types: npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > services/supabaseTypes.ts
// Replace 'Database' above with the generated type from supabaseTypes.ts if you do this.
// For now, we'll use a generic 'any' or rely on inference.
// If you create supabaseTypes.ts, it might look like this initially:
/*
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Define your tables here, e.g., manuscripts, blog_posts, etc.
    }
    Views: {
      // Define views if any
    }
    Functions: {
      // Define functions if any
    }
  }
}
*/
// For this update, we'll proceed without generating supabaseTypes.ts to keep it simpler.
// You can add it later for better type checking.
// So, for now, we can use:
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// And let Supabase infer types or use `any` where needed.
