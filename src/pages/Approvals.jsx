import { useMemo } from 'react'
import { CheckCircle2, RotateCcw } from 'lucide-react'
import { useApp } from '../store/AppContext.jsx'
import { Card, Badge, PageHeader } from '../components/ui.jsx'

export default function Approvals() {
  const {
    currentUser,
    teamMembers,
    sheetForEmployee,
    approveSheet,
    returnSheet,
  } = useApp()

  const members = useMemo(
    () => teamMembers(currentUser.id),
    [currentUser, teamMembers]
  )

  return (
    <>
      <PageHeader
        title="Goal Approvals"
        subtitle="Review and approve employee goal sheets."
      />

      <div className="space-y-4">
        {members.map((member) => {
          const sheet = sheetForEmployee(member.id)

          return (
            <Card key={member.id} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-ink">
                    {member.name}
                  </h2>
                  <p className="text-sm text-muted">
                    {member.title}
                  </p>
                </div>

                <Badge tone={sheet?.status === 'approved' ? 'ok' : 'warn'}>
                  {sheet?.status || 'No Sheet'}
                </Badge>
              </div>

              {sheet && (
                <div className="mt-4 flex gap-3">
                  <button
                    className="btn-primary"
                    onClick={() => approveSheet(sheet.id, currentUser.id)}
                  >
                    <CheckCircle2 size={16} />
                    Approve
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() =>
                      returnSheet(sheet.id, 'Please revise targets.', currentUser.id)
                    }
                  >
                    <RotateCcw size={16} />
                    Return
                  </button>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </>
  )
}