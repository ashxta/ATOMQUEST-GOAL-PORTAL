import { useMemo, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Target, ClipboardCheck, BarChart3, FileSpreadsheet,
  SlidersHorizontal, Bell, ChevronDown, LogOut, CheckCheck, Mail,
} from 'lucide-react'
import { useApp } from '../store/AppContext.jsx'
import { Avatar, Badge } from './ui.jsx'
import { classNames, timeAgo } from '../lib/utils.js'

const NAV = {
  employee: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/goals', label: 'My Goal Sheet', icon: Target },
  ],
  manager: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/approvals', label: 'My Team', icon: ClipboardCheck },
    { to: '/reports', label: 'Reports', icon: FileSpreadsheet },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  ],
  admin: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/reports', label: 'Reports', icon: FileSpreadsheet },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin', label: 'Cycle & Governance', icon: SlidersHorizontal },
  ],
}

const ROLE_LABEL = { employee: 'Employee', manager: 'Manager · L1', admin: 'Admin · HR' }

function CycleChip() {
  const { cycle } = useApp()
  const openCount = Object.values(cycle.windows).filter((w) => w === 'open').length
  return (
    <div className="mx-3 mb-3 rounded-lg border border-line bg-paper/70 px-3 py-2.5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        Active Cycle
      </div>
      <div className="mt-0.5 text-sm font-semibold text-ink">{cycle.name}</div>
      <div className="mt-1 flex flex-wrap gap-1">
        {Object.entries(cycle.windows).map(([k, v]) => (
          <span
            key={k}
            className={classNames(
              'rounded px-1.5 py-0.5 text-[10px] font-bold uppercase',
              v === 'open' ? 'bg-ok/15 text-ok' : 'bg-line text-muted'
            )}
          >
            {k === 'goalSetting' ? 'Setup' : k}
          </span>
        ))}
      </div>
    </div>
  )
}

function NotificationBell() {
  const { notifications, currentUser, markNotificationRead, markAllRead } = useApp()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const mine = useMemo(
    () =>
      notifications
        .filter((n) => n.userId === currentUser?.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [notifications, currentUser]
  )
  const unread = mine.filter((n) => !n.read).length

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-ink transition hover:bg-paper"
      >
        <Bell size={17} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-bad px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-2 w-80 animate-fadeUp overflow-hidden rounded-xl2 border border-line bg-surface shadow-lift">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <span className="text-sm font-semibold text-ink">Notifications</span>
              {unread > 0 && (
                <button
                  onClick={() => markAllRead(currentUser.id)}
                  className="text-xs font-semibold text-brand hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {mine.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-muted">You're all caught up.</p>
              )}
              {mine.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id)
                    setOpen(false)
                    navigate(n.link)
                  }}
                  className={classNames(
                    'flex w-full gap-2.5 border-b border-line px-4 py-3 text-left transition last:border-0 hover:bg-paper',
                    !n.read && 'bg-brand-light/40'
                  )}
                >
                  <Mail size={15} className="mt-0.5 shrink-0 text-brand" />
                  <span>
                    <span className="block text-sm leading-snug text-ink">{n.message}</span>
                    <span className="mt-0.5 block text-xs text-muted">{timeAgo(n.createdAt)}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="border-t border-line bg-paper/60 px-4 py-1.5 text-center text-[11px] text-muted">
              Delivered in-app · mirrors Email / Teams channels
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function RoleSwitcher() {
  const { users, currentUser, login } = useApp()
  const [open, setOpen] = useState(false)
  const grouped = {
    employee: users.filter((u) => u.role === 'employee'),
    manager: users.filter((u) => u.role === 'manager'),
    admin: users.filter((u) => u.role === 'admin'),
  }
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-line bg-surface py-1 pl-1 pr-2 transition hover:bg-paper"
      >
        <Avatar user={currentUser} size={30} />
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-semibold leading-tight text-ink">
            {currentUser?.name}
          </span>
          <span className="block text-[11px] leading-tight text-muted">
            {ROLE_LABEL[currentUser?.role]}
          </span>
        </span>
        <ChevronDown size={15} className="text-muted" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-2 w-72 animate-fadeUp overflow-hidden rounded-xl2 border border-line bg-surface shadow-lift">
            <div className="border-b border-line px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
              Switch user journey
            </div>
            <div className="max-h-[60vh] overflow-y-auto py-1">
              {['admin', 'manager', 'employee'].map((role) => (
                <div key={role}>
                  <div className="px-4 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-muted/70">
                    {ROLE_LABEL[role]}
                  </div>
                  {grouped[role].map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        login(u.id)
                        setOpen(false)
                      }}
                      className={classNames(
                        'flex w-full items-center gap-2.5 px-4 py-2 text-left transition hover:bg-paper',
                        u.id === currentUser?.id && 'bg-brand-light/50'
                      )}
                    >
                      <Avatar user={u} size={30} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-ink">
                          {u.name}
                        </span>
                        <span className="block truncate text-xs text-muted">{u.title}</span>
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function Layout() {
  const { currentUser, logout } = useApp()
  const nav = NAV[currentUser?.role] || []

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface md:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand">
            <CheckCheck size={20} className="text-accent-light" strokeWidth={2.5} />
          </span>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold text-ink">Aligned</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              Goal Portal
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-2">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-brand text-white shadow-card'
                    : 'text-muted hover:bg-paper hover:text-ink'
                )
              }
            >
              <Icon size={17} strokeWidth={2.2} />
              {label}
            </NavLink>
          ))}
        </nav>
        <CycleChip />
        <button
          onClick={logout}
          className="mx-3 mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-paper hover:text-bad"
        >
          <LogOut size={16} /> Sign out
        </button>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-paper/85 px-4 py-3 backdrop-blur sm:px-6">
          {/* mobile nav */}
          <nav className="flex gap-1 overflow-x-auto md:hidden">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  classNames(
                    'flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition',
                    isActive ? 'bg-brand text-white' : 'bg-surface text-muted border border-line'
                  )
                }
              >
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden text-sm font-medium text-muted md:block">
            {currentUser?.department}
            <span className="mx-2 text-line">·</span>
            <span className="text-ink">{currentUser?.title}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <NotificationBell />
            <RoleSwitcher />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl animate-fadeUp">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}