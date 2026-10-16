import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Client-side Supabase client using @supabase/ssr createBrowserClient.
 * Sessions are safely synchronized across browser tabs and cookies.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: {
      name: 'sb-admin-auth-token',
    },
  });
}

export const supabaseBrowser = createSupabaseBrowserClient();
