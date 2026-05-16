import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Target, CheckCircle2, Clock, TrendingUp, Users, ClipboardList, AlertTriangle,
  ShieldCheck, Layers, ArrowRight, MessageSquareText, Gauge,
} from 'lucide-react'
import { useApp } from '../store/AppContext.jsx'
import { StatCard, Card, Badge, Avatar, ProgressBar, ScoreChip, PageHeader, SectionTitle, EmptyState }
  from '../components/ui.jsx'
import { sheetScore } from '../lib/scoring.js'
import { totalWeight } from '../lib/validation.js'
import { GOAL_STATUS, QUARTERS, fmtDate, timeAgo } from '../lib/utils.js'

function useActiveQuarter() {
  const { cycle } = useApp()
  return useMemo(() => {
    const open = QUARTERS.filter((q) => cycle.windows[q.key] === 'open')
    return open.length ? open[open.length - 1] : QUARTERS[0]
  }, [cycle])
}

// --- Employee -------------------------------------------------------------
function EmployeeDashboard() {
  const { currentUser, goalsForEmployee, sheetForEmployee, audit } = useApp()
  const aq = useActiveQuarter()
  const goals = goalsForEmployee(currentUser.id)
  const sheet = sheetForEmployee(currentUser.id)
  const weight = totalWeight(goals)
  const score = sheetScore(goals, aq.key)
  const completedThisQ = goals.filter((g) => g.achievements?.[aq.key]?.status === 'completed').length
  const status = sheet ? GOAL_STATUS[sheet.status] : null
  const checkIn = sheet?.checkIns?.[aq.key]
  const myActivity = audit.filter((a) => a.actorId === currentUser.id).slice(0, 5)

  return (
    <>
      <PageHeader
        title={`Welcome, ${currentUser.name.split(' ')[0]}`}
        subtitle="Your goal sheet at a glance for this performance cycle."
      >
        <Link to="/goals" className="btn-primary">
          Open goal sheet <ArrowRight size={16} />
        </Link>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sheet status" value={status?.label || 'Not started'}
          icon={ClipboardList} tone={status?.tone === 'ok' ? 'ok' : 'brand'} />
        <StatCard label="Goals" value={`${goals.length} / 8`} sub={`Weightage ${weight}%`}
          icon={Target} tone={weight === 100 ? 'ok' : 'warn'} />
        <StatCard label={`${aq.label} progress`} value={score === null ? '—' : `${score}%`}
          sub={score === null ? 'Awaiting updates' : 'Computed · tracking only'}
          icon={TrendingUp} tone="accent" />
        <StatCard label="Completed goals" value={`${completedThisQ} / ${goals.length}`}
          sub={`${aq.label}`} icon={CheckCircle2} tone="ok" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle right={<Link to="/goals" className="text-xs font-semibold text-brand hover:underline">Manage</Link>}>
            Goal sheet
          </SectionTitle>
          {goals.length === 0 ? (
            <EmptyState icon={Target} title="No goals yet"
              hint="Start building your goal sheet for this cycle."
              action={<Link to="/goals" className="btn-primary btn-sm">Create goals</Link>} />
          ) : (
            <div className="space-y-2.5">
              {goals.map((g) => {
                const s = sheetScore([g], aq.key)
                return (
                  <div key={g.id} className="rounded-lg border border-line bg-paper/40 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-ink">{g.title}</span>
                          {g.isShared && <Badge tone="brand">Shared</Badge>}
                        </div>
                        <div className="mt-0.5 text-xs text-muted">
                          {g.thrustArea} · {g.weightage}% weightage
                        </div>
                      </div>
                      <ScoreChip score={s} />
                    </div>
                    <ProgressBar className="mt-2" value={s ?? 0}
                      tone={s === null ? 'brand' : s >= 90 ? 'ok' : s >= 60 ? 'warn' : 'bad'} />
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        <div className="space-y-5">
          {checkIn && (
            <Card className="p-5">
              <SectionTitle>Manager check-in · {aq.label}</SectionTitle>
              <div className="flex gap-2 rounded-lg bg-brand-light/50 p-3">
                <MessageSquareText size={16} className="mt-0.5 shrink-0 text-brand" />
                <p className="text-[13px] leading-snug text-ink">{checkIn.comment}</p>
              </div>
              <p className="mt-2 text-xs text-muted">Logged {timeAgo(checkIn.createdAt)}</p>
            </Card>
          )}
          <Card className="p-5">
            <SectionTitle>Recent activity</SectionTitle>
            {myActivity.length === 0 ? (
              <p className="text-sm text-muted">Nothing yet.</p>
            ) : (
              <ul className="space-y-2.5">
                {myActivity.map((a) => (
                  <li key={a.id} className="flex gap-2.5 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <span>
                      <span className="text-ink">{a.action}</span>
                      <span className="block text-xs text-muted">{timeAgo(a.timestamp)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}

// --- Manager --------------------------------------------------------------
function ManagerDashboard() {
  const { currentUser, teamMembers, goalsForEmployee, sheetForEmployee } = useApp()
  const aq = useActiveQuarter()
  const team = teamMembers(currentUser.id)

  const rows = team.map((m) => {
    const goals = goalsForEmployee(m.id)
    const sheet = sheetForEmployee(m.id)
    return { m, goals, sheet, score: sheetScore(goals, aq.key) }
  })
  const pending = rows.filter((r) => r.sheet?.status === 'submitted').length
  const checkinsDone = rows.filter((r) => r.sheet?.checkIns?.[aq.key]).length
  const approved = rows.filter((r) => r.sheet?.status === 'approved').length
  const teamScores = rows.map((r) => r.score).filter((s) => s !== null)
  const avg = teamScores.length
    ? Math.round(teamScores.reduce((a, b) => a + b, 0) / teamScores.length)
    : null

  return (
    <>
      <PageHeader title={`${currentUser.department} Team`}
        subtitle="Approvals, check-ins and team progress for the active cycle.">
        <Link to="/approvals" className="btn-primary">
          Go to approvals <ArrowRight size={16} />
        </Link>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Team members" value={team.length} icon={Users} tone="brand" />
        <StatCard label="Pending approvals" value={pending}
          sub={pending ? 'Action needed' : 'All clear'} icon={Clock}
          tone={pending ? 'warn' : 'ok'} />
        <StatCard label={`${aq.label} check-ins`} value={`${checkinsDone} / ${team.length}`}
          icon={ClipboardList} tone={checkinsDone === team.length ? 'ok' : 'warn'} />
        <StatCard label="Team avg score" value={avg === null ? '—' : `${avg}%`}
          sub="Computed · tracking only" icon={Gauge} tone="accent" />
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Team roster</h2>
          <Badge tone="brand">{approved} approved</Badge>
        </div>
        <div className="divide-y divide-line">
          {rows.map(({ m, goals, sheet, score }) => (
            <div key={m.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <Avatar user={m} size={38} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-ink">{m.name}</div>
                <div className="text-xs text-muted">{m.title}</div>
              </div>
              <div className="hidden w-40 sm:block">
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>{goals.length} goals</span>
                  <span>{score === null ? '—' : `${score}%`}</span>
                </div>
                <ProgressBar value={score ?? 0}
                  tone={score === null ? 'brand' : score >= 90 ? 'ok' : score >= 60 ? 'warn' : 'bad'} />
              </div>
              <Badge tone={sheet ? GOAL_STATUS[sheet.status].tone : 'muted'}>
                {sheet ? GOAL_STATUS[sheet.status].label : 'Not started'}
              </Badge>
              <Link to="/approvals" className="btn-ghost btn-sm">Review</Link>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

// --- Admin ----------------------------------------------------------------
function AdminDashboard() {
  const { users, sheets, goals, cycle, escalationRules, sheetForEmployee, goalsForEmployee }
    = useApp()
  const aq = useActiveQuarter()
  const employees = users.filter((u) => u.role === 'employee')

  const stateCount = { draft: 0, submitted: 0, returned: 0, approved: 0, none: 0 }
  employees.forEach((e) => {
    const s = sheetForEmployee(e.id)
    if (!s) stateCount.none++
    else stateCount[s.status]++
  })
  const checkinDone = employees.filter((e) => sheetForEmployee(e.id)?.checkIns?.[aq.key]).length
  const completionPct = employees.length
    ? Math.round((checkinDone / employees.length) * 100)
    : 0

  // live escalation count (computed against rules + current data)
  const escalations = useMemo(() => {
    let count = 0
    const cycleOpen = new Date(cycle.openedAt).getTime()
    employees.forEach((e) => {
      const s = sheetForEmployee(e.id)
      const r1 = escalationRules.find((r) => r.condition === 'employee_no_submit')
      if (r1?.enabled && (!s || s.status === 'draft' || s.status === 'returned')) {
        if (Date.now() - cycleOpen > r1.days * 86400000) count++
      }
      const r2 = escalationRules.find((r) => r.condition === 'manager_no_approve')
      if (r2?.enabled && s?.status === 'submitted' && s.submittedAt) {
        if (Date.now() - new Date(s.submittedAt).getTime() > r2.days * 86400000) count++
      }
    })
    return count
  }, [employees, sheetForEmployee, escalationRules, cycle])

  return (
    <>
      <PageHeader title="Organisation Overview"
        subtitle={`${cycle.name} — cycle health, completion and governance.`}>
        <Link to="/admin" className="btn-primary">
          Cycle &amp; governance <ArrowRight size={16} />
        </Link>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Employees" value={employees.length} icon={Users} tone="brand" />
        <StatCard label="Sheets approved" value={`${stateCount.approved} / ${employees.length}`}
          icon={ShieldCheck} tone="ok" />
        <StatCard label={`${aq.label} completion`} value={`${completionPct}%`}
          sub={`${checkinDone} of ${employees.length} checked in`} icon={Gauge} tone="accent" />
        <StatCard label="Open escalations" value={escalations}
          sub={escalations ? 'Needs attention' : 'All clear'} icon={AlertTriangle}
          tone={escalations ? 'bad' : 'ok'} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle>Goal sheet pipeline</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { k: 'draft', label: 'Draft', tone: 'muted' },
              { k: 'submitted', label: 'Pending', tone: 'warn' },
              { k: 'returned', label: 'Returned', tone: 'bad' },
              { k: 'approved', label: 'Approved', tone: 'ok' },
            ].map((x) => (
              <div key={x.k} className="rounded-lg border border-line bg-paper/40 p-3 text-center">
                <div className="font-display text-2xl font-semibold text-ink">
                  {stateCount[x.k]}
                </div>
                <Badge tone={x.tone} className="mt-1">{x.label}</Badge>
              </div>
            ))}
          </div>
          <SectionTitle right={null}>
            <span className="mt-5 block">Employee roster</span>
          </SectionTitle>
          <div className="divide-y divide-line rounded-lg border border-line">
            {employees.map((e) => {
              const s = sheetForEmployee(e.id)
              const gc = goalsForEmployee(e.id).length
              return (
                <div key={e.id} className="flex items-center gap-3 px-3 py-2.5">
                  <Avatar user={e} size={32} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink">{e.name}</div>
                    <div className="text-xs text-muted">{e.department} · {gc} goals</div>
                  </div>
                  <Badge tone={s ? GOAL_STATUS[s.status].tone : 'muted'}>
                    {s ? GOAL_STATUS[s.status].label : 'Not started'}
                  </Badge>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle>Cycle windows</SectionTitle>
          <div className="space-y-2">
            {Object.entries(cycle.windows).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between rounded-lg border border-line bg-paper/40 px-3 py-2">
                <span className="text-sm font-medium capitalize text-ink">
                  {k === 'goalSetting' ? 'Goal Setting' : k.toUpperCase()}
                </span>
                <Badge tone={v === 'open' ? 'ok' : 'muted'}>{v}</Badge>
              </div>
            ))}
          </div>
          <Link to="/admin" className="btn-ghost btn-sm mt-4 w-full">
            <Layers size={14} /> Manage windows
          </Link>
        </Card>
      </div>
    </>
  )
}

export default function Dashboard() {
  const { currentUser } = useApp()
  if (currentUser.role === 'manager') return <ManagerDashboard />
  if (currentUser.role === 'admin') return <AdminDashboard />
  return <EmployeeDashboard />
}
