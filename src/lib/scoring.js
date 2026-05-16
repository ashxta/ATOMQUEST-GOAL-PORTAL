// ---------------------------------------------------------------------------
// Scoring engine
// Implements the system-computed progress scores from BRD section 2.2.
// Scores are for TRACKING ONLY — never used as performance ratings.
// ---------------------------------------------------------------------------

// Unit-of-Measurement catalogue. numeric/percent additionally carry a
// `direction` (higher = "Min" in the BRD i.e. higher is better;
// lower = "Max" i.e. lower is better such as TAT or cost).
export const UOM_TYPES = {
  numeric: { label: 'Numeric', hint: 'A count or amount (e.g. 120 deals, 5000 units)' },
  percent: { label: 'Percentage', hint: 'A 0–100 percentage value' },
  timeline: { label: 'Timeline', hint: 'A target completion date' },
  zero: { label: 'Zero-based', hint: 'Success means zero — e.g. safety incidents' },
}

export const DIRECTIONS = {
  higher: { label: 'Higher is better', note: 'e.g. Sales Revenue, NPS' },
  lower: { label: 'Lower is better', note: 'e.g. Turnaround Time, Cost' },
}

export function uomLabel(goal) {
  const base = UOM_TYPES[goal.uomType]?.label || goal.uomType
  if (goal.uomType === 'numeric' || goal.uomType === 'percent') {
    return `${base} · ${goal.direction === 'lower' ? 'Lower better' : 'Higher better'}`
  }
  return base
}

// Format a target/actual value for display based on UoM type.
export function formatValue(goal, value) {
  if (value === null || value === undefined || value === '') return '—'
  if (goal.uomType === 'percent') return `${value}%`
  if (goal.uomType === 'timeline') return value // ISO date string
  if (goal.uomType === 'zero') return Number(value) === 0 ? '0' : String(value)
  return String(value)
}

// Compute a progress score (0–100, capped) for a single goal in a quarter.
// Returns null when the quarter has no recorded achievement yet.
export function computeScore(goal, achievement) {
  if (!achievement || achievement.status === 'not_started') return null
  const target = goal.target
  const actual = achievement.actual

  if (goal.uomType === 'zero') {
    if (actual === null || actual === undefined || actual === '') return null
    return Number(actual) === 0 ? 100 : 0
  }

  if (goal.uomType === 'timeline') {
    if (!actual || !target) return null
    const done = new Date(actual).getTime()
    const due = new Date(target).getTime()
    if (Number.isNaN(done) || Number.isNaN(due)) return null
    // On time or early -> 100%. Late -> linear decay, 1 pt lost per day, floored at 0.
    if (done <= due) return 100
    const daysLate = Math.ceil((done - due) / 86400000)
    return Math.max(0, 100 - daysLate)
  }

  // numeric / percent
  const t = Number(target)
  const a = Number(actual)
  if (Number.isNaN(t) || Number.isNaN(a) || a === null) return null

  let score
  if (goal.direction === 'lower') {
    // Lower is better: Target / Achievement
    if (a <= 0) return t <= 0 ? 100 : 100
    score = (t / a) * 100
  } else {
    // Higher is better: Achievement / Target
    if (t === 0) return a === 0 ? 100 : 100
    score = (a / t) * 100
  }
  return Math.max(0, Math.min(150, Math.round(score)))
}

// Weighted roll-up across an employee's goal sheet for a given quarter.
export function sheetScore(goals, quarter) {
  let weighted = 0
  let coveredWeight = 0
  for (const g of goals) {
    const s = computeScore(g, g.achievements?.[quarter])
    if (s !== null) {
      weighted += s * (g.weightage / 100)
      coveredWeight += g.weightage
    }
  }
  if (coveredWeight === 0) return null
  // normalise by the weight that actually has data
  return Math.round((weighted / coveredWeight) * 100)
}

// A simple traffic-light band for a score.
export function scoreBand(score) {
  if (score === null || score === undefined) return 'none'
  if (score >= 90) return 'ok'
  if (score >= 60) return 'warn'
  return 'bad'
}