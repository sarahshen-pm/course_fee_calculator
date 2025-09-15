import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      `Missing Supabase environment variables. Please check your .env.local file and ensure you have:
      - NEXT_PUBLIC_SUPABASE_URL
      - NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      Get these values from: https://supabase.com/dashboard/project/_/settings/api`
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
