import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

import { useApp } from '../store/AppContext.jsx'
import { Card, PageHeader } from '../components/ui.jsx'

export default function Analytics() {
  const { goals } = useApp()

  const data = goals.map((g) => ({
    name: g.title.slice(0, 12),
    weightage: g.weightage,
  }))

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Organisation-wide performance insights."
      />

      <Card className="p-5">
        <h2 className="mb-4 text-lg font-semibold text-ink">
          Goal Weightage Distribution
        </h2>

        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="weightage" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  )