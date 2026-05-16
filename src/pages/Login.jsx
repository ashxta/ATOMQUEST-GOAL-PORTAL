import { CheckCheck, ArrowRight, Shield, Users, User } from 'lucide-react'
import { useApp } from '../store/AppContext.jsx'
import { Avatar } from '../components/ui.jsx'

const ROLE_META = {
  admin: {
    icon: Shield,
    title: 'Admin / HR',
    blurb: 'Configure cycles, push shared goals, audit changes and resolve escalations.',
  },
  manager: {
    icon: Users,
    title: 'Manager (L1)',
    blurb: 'Review and approve goal sheets, run quarterly check-ins, track your team.',
  },
  employee: {
    icon: User,
    title: 'Employee',
    blurb: 'Draft a goal sheet, log quarterly achievement and watch progress unfold.',
  },
}

export default function Login() {
  const { users, login } = useApp()
  const byRole = (r) => users.filter((u) => u.role === r)

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_1.15fr]">
        {/* Left — brand panel */}
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand">
              <CheckCheck size={26} className="text-accent-light" strokeWidth={2.5} />
            </span>
            <div>
              <div className="font-display text-2xl font-semibold text-ink">Aligned</div>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted">
                Goal Setting &amp; Tracking Portal
              </div>
            </div>
          </div>
          <h1 className="mt-8 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Every goal,
            <br />
            <span className="text-brand">aligned and accountable.</span>
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            A structured, audit-ready portal for the full goal lifecycle — creation, L1 approval,
            quarterly check-ins and organisation-wide visibility. No more spreadsheets, no more
            blind spots.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-ink">
            {[
              'Weightage-validated goal sheets with manager approval',
              'Quarterly achievement tracking with computed progress scores',
              'Shared departmental goals, audit trail and escalations',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckCheck size={17} className="mt-0.5 shrink-0 text-brand" />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 inline-block rounded-lg border border-line bg-surface px-3 py-2 text-xs text-muted">
            AtomQuest Hackathon 1.0 · pick any persona below to explore that journey
          </div>
        </div>

        {/* Right — persona picker */}
        <div className="space-y-4">
          {['admin', 'manager', 'employee'].map((role) => {
            const Meta = ROLE_META[role]
            const Icon = Meta.icon
            return (
              <div key={role} className="card p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-light text-brand">
                    <Icon size={20} strokeWidth={2.2} />
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-ink">{Meta.title}</h2>
                    <p className="text-[13px] leading-snug text-muted">{Meta.blurb}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {byRole(role).map((u) => (
                    <button
                      key={u.id}
                      onClick={() => login(u.id)}
                      className="group flex items-center gap-2.5 rounded-lg border border-line bg-paper/60 px-3 py-2 text-left transition hover:border-brand hover:bg-brand-light/50"
                    >
                      <Avatar user={u} size={34} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink">
                          {u.name}
                        </span>
                        <span className="block truncate text-xs text-muted">{u.department}</span>
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-muted transition group-hover:translate-x-0.5 group-hover:text-brand"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
