import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client.
 * ---------------------------------------------------------------------------
 * URL + anon key are PUBLIC values — safe to ship in the browser. All real
 * protection is enforced server-side by Supabase Row Level Security policies
 * (which restrict admin data to the owner's authenticated account). The
 * client-side ADMIN_EMAIL check below only toggles UI visibility.
 */
const SUPABASE_URL = 'https://fhtaxmsbqwdltiupeidz.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZodGF4bXNicXdkbHRpdXBlaWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MjUxMDQsImV4cCI6MjEwMDUwMTEwNH0.gmU6sOPMSmHVGwM46eDvA4IWuGciXXhjh5LoUHiMjrk'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

/** Only this account is treated as the owner/admin. */
export const ADMIN_EMAIL = 'luis@empcnet.com'
