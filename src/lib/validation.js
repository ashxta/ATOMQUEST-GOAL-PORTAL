// ---------------------------------------------------------------------------
// Validation engine — enforces BRD section 2.1 rules:
//   • Total weightage across all goals must equal 100%
//   • Minimum weightage per individual goal: 10%
//   • Maximum number of goals per employee: 8
// ---------------------------------------------------------------------------

export const RULES = {
  MIN_WEIGHT: 10,
  MAX_WEIGHT: 100,
  TOTAL_WEIGHT: 100,
  MAX_GOALS: 8,
}

// Validate a single goal's fields before it can be saved.
export function validateGoal(goal) {
  const errors = {}
  if (!goal.thrustArea) errors.thrustArea = 'Select a thrust area'
  if (!goal.title || goal.title.trim().length < 4)
    errors.title = 'Title must be at least 4 characters'
  if (!goal.uomType) errors.uomType = 'Select a unit of measurement'

  const w = Number(goal.weightage)
  if (Number.isNaN(w) || w < RULES.MIN_WEIGHT)
    errors.weightage = `Minimum weightage is ${RULES.MIN_WEIGHT}%`
  else if (w > RULES.MAX_WEIGHT) errors.weightage = `Weightage cannot exceed ${RULES.MAX_WEIGHT}%`

  if (goal.uomType === 'timeline') {
    if (!goal.target) errors.target = 'Set a target date'
  } else if (goal.uomType === 'zero') {
    // target is implicitly 0 — no input needed
  } else {
    if (goal.target === '' || goal.target === null || goal.target === undefined)
      errors.target = 'Set a numeric target'
    else if (Number.isNaN(Number(goal.target))) errors.target = 'Target must be a number'
  }
  return errors
}

// Validate the whole goal sheet before submission for approval.
export function validateSheet(goals) {
  const problems = []
  if (goals.length === 0) problems.push('Add at least one goal before submitting.')
  if (goals.length > RULES.MAX_GOALS)
    problems.push(`A maximum of ${RULES.MAX_GOALS} goals is allowed (you have ${goals.length}).`)

  const total = goals.reduce((s, g) => s + Number(g.weightage || 0), 0)
  if (goals.length > 0 && total !== RULES.TOTAL_WEIGHT)
    problems.push(`Total weightage must equal 100% — currently ${total}%.`)

  for (const g of goals) {
    if (Number(g.weightage) < RULES.MIN_WEIGHT)
      problems.push(`"${g.title || 'Untitled goal'}" is below the ${RULES.MIN_WEIGHT}% minimum.`)
    const fieldErrors = validateGoal(g)
    if (Object.keys(fieldErrors).length)
      problems.push(`"${g.title || 'Untitled goal'}" has incomplete fields.`)
  }
  return problems
}

export function totalWeight(goals) {
  return goals.reduce((s, g) => s + Number(g.weightage || 0), 0)
}