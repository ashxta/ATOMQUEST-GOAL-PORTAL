// ---------------------------------------------------------------------------
// Shared utilities
// ---------------------------------------------------------------------------

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}

export function nowISO() {
  return new Date().toISOString()
}

// Human-friendly relative time, e.g. "3h ago", "2d ago".
export function timeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.round(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  if (d < 30) return `${d}d ago`
  return new Date(iso).toLocaleDateString()
}

export function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// --- Quarterly check-in windows (BRD section 2.3) -------------------------
export const QUARTERS = [
  { key: 'q1', label: 'Q1 Check-in', month: 'July' },
  { key: 'q2', label: 'Q2 Check-in', month: 'October' },
  { key: 'q3', label: 'Q3 Check-in', month: 'January' },
  { key: 'q4', label: 'Q4 / Annual', month: 'March / April' },
]

export const PHASES = [
  { key: 'goalSetting', label: 'Phase 1 — Goal Setting', month: '1st May' },
  { key: 'q1', label: 'Q1 Check-in', month: 'July' },
  { key: 'q2', label: 'Q2 Check-in', month: 'October' },
  { key: 'q3', label: 'Q3 Check-in', month: 'January' },
  { key: 'q4', label: 'Q4 / Annual', month: 'March / April' },
]

// --- CSV export -----------------------------------------------------------
function csvCell(v) {
  const s = v === null || v === undefined ? '' : String(v)
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function downloadCSV(filename, rows) {
  const csv = rows.map((r) => r.map(csvCell).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function classNames(...xs) {
  return xs.filter(Boolean).join(' ')
}

// Goal lifecycle status metadata.
export const GOAL_STATUS = {
  draft: { label: 'Draft', tone: 'muted' },
  submitted: { label: 'Pending Approval', tone: 'warn' },
  returned: { label: 'Returned for Rework', tone: 'bad' },
  approved: { label: 'Approved · Locked', tone: 'ok' },
}

export const ACHIEVEMENT_STATUS = {
  not_started: { label: 'Not Started', tone: 'muted' },
  on_track: { label: 'On Track', tone: 'warn' },
  completed: { label: 'Completed', tone: 'ok' },
}