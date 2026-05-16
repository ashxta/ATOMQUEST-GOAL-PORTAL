import { useMemo } from 'react'
import { Download } from 'lucide-react'
import { useApp } from '../store/AppContext.jsx'
import { Card, PageHeader } from '../components/ui.jsx'
import { downloadCSV } from '../lib/utils.js'

export default function Reports() {
  const { users, goals } = useApp()

  const rows = useMemo(() => {
    return goals.map((g) => {
      const user = users.find((u) => u.id === g.employeeId)

      return [
        user?.name,
        g.title,
        g.target,
        g.weightage,
        g.status,
      ]
    })
  }, [goals, users])

  const exportReport = () => {
    downloadCSV('goal-report.csv', [
      ['Employee', 'Goal', 'Target', 'Weightage', 'Status'],
      ...rows,
    ])
  }

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Export performance and achievement reports."
      >
        <button className="btn-primary" onClick={exportReport}>
          <Download size={16} />
          Export CSV
        </button>
      </PageHeader>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper text-left text-muted">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Goal</th>
              <th className="p-3">Target</th>
              <th className="p-3">Weightage</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-t border-line">
                {r.map((c, i) => (
                  <td key={i} className="p-3">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  )
}