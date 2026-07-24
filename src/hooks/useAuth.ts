import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase, ADMIN_EMAIL } from '@/lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  /** True only when signed in AS the owner account. UI-gating only — RLS is the real guard. */
  isAdmin: boolean
  signIn: () => Promise<unknown>
  signOut: () => Promise<unknown>
}

/** Tracks the Supabase session and exposes Google sign-in / sign-out. */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const isAdmin = !!user?.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()

  return {
    user,
    loading,
    isAdmin,
    signIn: () =>
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/admin` },
      }),
    signOut: () => supabase.auth.signOut(),
  }
}
