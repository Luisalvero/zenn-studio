import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, LogOut, Inbox, SlidersHorizontal, Film, ArrowLeft, ShieldAlert } from 'lucide-react'
import { SEO } from '@/components/ui/SEO'
import { GoogleIcon } from '@/components/ui/BrandIcons'
import { useAuth } from '@/hooks/useAuth'
import { ADMIN_EMAIL } from '@/lib/supabase'

/** Full-screen dark shell for the admin (no public nav/footer). */
function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-[100svh] flex-col bg-void text-silver">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35] mask-fade-b" />
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  )
}

const featureCards = [
  { icon: Inbox, title: 'Leads', body: 'Every contact-form inquiry, in one place.' },
  { icon: SlidersHorizontal, title: 'Content', body: 'Availability, hero & about copy, showreel.' },
  { icon: Film, title: 'Portfolio', body: 'Add, edit, and reorder your projects.' },
]

export function AdminPage() {
  const { user, loading, isAdmin, signIn, signOut } = useAuth()

  return (
    <>
      <SEO title="Admin" path="/admin" noIndex />
      <AdminShell>
        {/* Loading */}
        {loading && (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-ash" />
          </div>
        )}

        {/* Signed out — login */}
        {!loading && !user && (
          <div className="flex flex-1 items-center justify-center px-6">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-carbon p-8 text-center">
              <span className="mx-auto mb-6 flex h-11 w-11 items-center justify-center rounded-md border border-white/15 bg-white/[0.02]">
                <span className="font-display text-base font-bold tracking-tight text-chalk">Z</span>
              </span>
              <h1 className="font-display text-2xl font-semibold text-chalk">Studio Admin</h1>
              <p className="mt-2 text-sm text-mist">Owner access only. Sign in to continue.</p>
              <button
                onClick={() => signIn()}
                className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-chalk px-6 py-3.5 text-sm font-medium text-void transition-all duration-300 hover:-translate-y-0.5 hover:bg-bone"
              >
                <GoogleIcon className="h-5 w-5" />
                Continue with Google
              </button>
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-1.5 text-xs text-ash transition-colors hover:text-mist"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to site
              </Link>
            </div>
          </div>
        )}

        {/* Signed in but not the owner */}
        {!loading && user && !isAdmin && (
          <div className="flex flex-1 items-center justify-center px-6">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-carbon p-8 text-center">
              <ShieldAlert className="mx-auto h-8 w-8 text-ember-soft" strokeWidth={1.5} />
              <h1 className="mt-4 font-display text-xl font-semibold text-chalk">Not authorized</h1>
              <p className="mt-2 text-sm text-mist">
                You're signed in as <span className="text-silver">{user.email}</span>, which isn't the
                owner account. Sign in with <span className="text-silver">{ADMIN_EMAIL}</span>.
              </p>
              <button
                onClick={() => signOut()}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-bone transition-colors hover:bg-white/5"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        )}

        {/* Signed in as owner — dashboard shell */}
        {!loading && isAdmin && user && (
          <>
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 sm:px-10">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-white/15">
                  <span className="font-display text-xs font-bold text-chalk">Z</span>
                </span>
                <span className="font-display text-sm font-semibold tracking-tight text-chalk">
                  Studio Admin
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden text-xs text-ash sm:inline">{user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-bone transition-colors hover:bg-white/5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            </header>

            <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 sm:px-10">
              <p className="eyebrow">Dashboard</p>
              <h1 className="mt-3 font-display text-3xl font-semibold text-chalk sm:text-4xl">
                Welcome back.
              </h1>
              <p className="mt-3 max-w-xl text-sm text-mist">
                Sign-in is working. Next I'll switch these on one at a time — leads, content, then the
                full portfolio editor.
              </p>

              <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-3">
                {featureCards.map(({ icon: Icon, title, body }) => (
                  <div key={title} className="flex flex-col gap-3 bg-carbon p-6">
                    <div className="flex items-center justify-between">
                      <Icon className="h-6 w-6 text-bone" strokeWidth={1.4} />
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.15em] text-ash">
                        Soon
                      </span>
                    </div>
                    <h2 className="font-display text-lg font-semibold text-chalk">{title}</h2>
                    <p className="text-sm text-mist">{body}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/"
                className="mt-10 inline-flex items-center gap-1.5 text-sm text-mist transition-colors hover:text-chalk"
              >
                <ArrowLeft className="h-4 w-4" />
                View live site
              </Link>
            </main>
          </>
        )}
      </AdminShell>
    </>
  )
}
