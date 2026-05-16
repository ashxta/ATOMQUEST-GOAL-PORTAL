import { useApp } from '../store/AppContext.jsx'
import { Card, Badge, PageHeader } from '../components/ui.jsx'

export default function Admin() {
  const { cycle, setWindow, currentUser } = useApp()

  const toggleWindow = (key) => {
    const next = cycle.windows[key] === 'open' ? 'closed' : 'open'
    setWindow(key, next, currentUser.id)
  }

  return (
    <>
      <PageHeader
        title="Cycle & Governance"
        subtitle="Manage quarterly windows and governance controls."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(cycle.windows).map(([key, value]) => (
          <Card key={key} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold capitalize text-ink">
                  {key}
                </h2>

                <p className="text-sm text-muted">
                  Manage this cycle window
                </p>
              </div>

              <Badge tone={value === 'open' ? 'ok' : 'muted'}>
                {value}
              </Badge>
            </div>

            <button
              className="btn-primary mt-4"
              onClick={() => toggleWindow(key)}
            >
              Toggle Window
            </button>
          </Card>
        ))}
      </div>
    </>
  )
}