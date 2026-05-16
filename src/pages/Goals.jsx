import { useMemo } from 'react'
import { Target, PlusCircle } from 'lucide-react'
import { useApp } from '../store/AppContext.jsx'
import { Card, Badge, ProgressBar, PageHeader, EmptyState } from '../components/ui.jsx'
import { computeScore } from '../lib/scoring.js'

export default function Goals() {
  const { currentUser, goalsForEmployee } = useApp()

  const goals = useMemo(
    () => goalsForEmployee(currentUser.id),
    [currentUser, goalsForEmployee]
  )

  return (
    <>
      <PageHeader
        title="My Goal Sheet"
        subtitle="Manage and monitor your assigned goals."
      />

      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals available"
          hint="Create goals to begin tracking progress."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => {
            const score = computeScore(goal, goal.achievements?.q1)

            return (
              <Card key={goal.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-ink">
                      {goal.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      {goal.description}
                    </p>
                  </div>

                  <Badge tone="brand">
                    {goal.weightage}%
                  </Badge>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Target</span>
                    <span className="font-medium text-ink">
                      {goal.target} {goal.unit}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Thrust Area</span>
                    <span className="font-medium text-ink">
                      {goal.thrustArea}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <ProgressBar value={score || 0} />
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}