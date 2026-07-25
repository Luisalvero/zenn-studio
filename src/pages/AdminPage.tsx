import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, LogOut, Inbox, SlidersHorizontal, Film, Music2, ArrowLeft, ShieldAlert } from 'lucide-react'
import { SEO } from '@/components/ui/SEO'
import { GoogleIcon } from '@/components/ui/BrandIcons'
import { LeadsPanel } from '@/components/admin/LeadsPanel'
import { ContentPanel } from '@/components/admin/ContentPanel'
import { PortfolioPanel } from '@/components/admin/PortfolioPanel'
import { SoundPanel } from '@/components/admin/SoundPanel'
import { useAuth } from '@/hooks/useAuth'
import { ADMIN_EMAIL } from '@/lib/supabase'
import { cn } from '@/lib/utils'

/** Full-screen dark shell for the admin (no public nav/footer). */
function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-[100svh] flex-col bg-void text-silver">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35] mask-fade-b" />
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  )
}

type Tab = 'leads' | 'content' | 'portfolio' | 'sound'
const TABS = [
  { key: 'leads', label: 'Leads', icon: Inbox, soon: false },
  { key: 'content', label: 'Content', icon: SlidersHorizontal, soon: false },
  { key: 'portfolio', label: 'Portfolio', icon: Film, soon: false },
  { key: 'sound', label: 'Sound', icon: Music2, soon: false },
] as const

export function AdminPage() {
  const { user, loading, isAdmin, signIn, signOut } = useAuth()
  const [tab, setTab] = useState<Tab>('leads')
  // Local dev: skip the Google login entirely (the Sound editor writes to a
  // local file, so no auth is needed on localhost). Production stays locked.
  const bypass = import.meta.env.DEV

  return (
    <>
      <SEO title="Admin" path="/admin" noIndex />
      <AdminShell>
        {loading && !bypass && (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-ash" />
          </div>
        )}

        {/* Signed out — login */}
        {!loading && !user && !bypass && (
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
        {!loading && user && !isAdmin && !bypass && (
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

        {/* Signed in as owner — dashboard (or local dev bypass) */}
        {(bypass || (!loading && isAdmin && user)) && (
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
                <span className="hidden text-xs text-ash sm:inline">{user?.email ?? 'Local dev (no login)'}</span>
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-bone transition-colors hover:bg-white/5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            </header>

            <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 sm:px-10">
              {/* Tabs */}
              <nav className="mb-8 flex gap-1 border-b border-white/10">
                {TABS.map((t) => {
                  const Icon = t.icon
                  return (
                    <button
                      key={t.key}
                      onClick={() => !t.soon && setTab(t.key)}
                      disabled={t.soon}
                      className={cn(
                        'relative flex items-center gap-2 px-4 py-3 text-sm transition-colors',
                        tab === t.key ? 'text-chalk' : 'text-mist hover:text-bone',
                        t.soon && 'cursor-not-allowed text-ash/40 hover:text-ash/40',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {t.label}
                      {t.soon && (
                        <span className="text-[0.55rem] uppercase tracking-wider text-ash/60">soon</span>
                      )}
                      {tab === t.key && <span className="absolute inset-x-2 -bottom-px h-px bg-chalk" />}
                    </button>
                  )
                })}
              </nav>

              {tab === 'leads' && <LeadsPanel />}
              {tab === 'content' && <ContentPanel />}
              {tab === 'portfolio' && <PortfolioPanel />}
              {tab === 'sound' && <SoundPanel />}

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
