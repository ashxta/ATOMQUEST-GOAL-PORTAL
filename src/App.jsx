import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './store/AppContext.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Goals from './pages/Goals.jsx'
import Approvals from './pages/Approvals.jsx'
import Reports from './pages/Reports.jsx'
import Analytics from './pages/Analytics.jsx'
import Admin from './pages/Admin.jsx'

// Restrict a route to specific roles; bounce others to their dashboard.
function Guard({ roles, children }) {
  const { currentUser } = useApp()
  if (!currentUser) return <Navigate to="/" replace />
  if (roles && !roles.includes(currentUser.role)) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { currentUser } = useApp()

  if (!currentUser) return <Login />

  return (
    <Routes>
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
    </Routes>
  )
}
