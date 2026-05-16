export default function App() {
  const { currentUser } = useApp()

  return (
    <Routes>
      {!currentUser ? (
        <Route path="*" element={<Login />} />
      ) : (
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/goals"
            element={
              <Guard roles={['employee']}>
                <Goals />
              </Guard>
            }
          />

          <Route
            path="/approvals"
            element={
              <Guard roles={['manager']}>
                <Approvals />
              </Guard>
            }
          />

          <Route
            path="/reports"
            element={
              <Guard roles={['manager', 'admin']}>
                <Reports />
              </Guard>
            }
          />

          <Route
            path="/analytics"
            element={
              <Guard roles={['manager', 'admin']}>
                <Analytics />
              </Guard>
            }
          />

          <Route
            path="/admin"
            element={
              <Guard roles={['admin']}>
                <Admin />
              </Guard>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      )}
    </Routes>
  )
}
