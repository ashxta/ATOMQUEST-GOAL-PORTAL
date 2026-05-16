import React, { createContext, useContext, useState, useEffect } from 'react'
import { USERS, GOALS, SHEETS, CYCLE, AUDIT, NOTIFICATIONS, ESCALATION_RULES } from '../data/seed.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Initialize state from localStorage or fallback to seed data
  const [users] = useState(() => JSON.parse(localStorage.getItem('aq_users')) || USERS)
  const [goals, setGoals] = useState(() => JSON.parse(localStorage.getItem('aq_goals')) || GOALS)
  const [sheets, setSheets] = useState(() => JSON.parse(localStorage.getItem('aq_sheets')) || SHEETS)
  const [cycle, setCycle] = useState(() => JSON.parse(localStorage.getItem('aq_cycle')) || CYCLE)
  const [audit, setAudit] = useState(() => JSON.parse(localStorage.getItem('aq_audit')) || AUDIT)
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('aq_notifications')) || NOTIFICATIONS)
  const [escalationRules] = useState(() => JSON.parse(localStorage.getItem('aq_escalation_rules')) || ESCALATION_RULES)
  
  // Default login user as the first employee (Rohan Das) to showcase state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('aq_current_user')
    return saved ? JSON.parse(saved) : USERS.find(u => u.id === 'u_emp_rohan')
  })

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('aq_goals', JSON.stringify(goals))
    localStorage.setItem('aq_sheets', JSON.stringify(sheets))
    localStorage.setItem('aq_cycle', JSON.stringify(cycle))
    localStorage.setItem('aq_audit', JSON.stringify(audit))
    localStorage.setItem('aq_notifications', JSON.stringify(notifications))
    if (currentUser) localStorage.setItem('aq_current_user', JSON.stringify(currentUser))
  }, [goals, sheets, cycle, audit, notifications, currentUser])

  // Auth functions
  const login = (userId) => {
    const user = users.find(u => u.id === userId)
    if (user) setCurrentUser(user)
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('aq_current_user')
  }

  // Data Selectors
  const goalsForEmployee = (empId) => goals.filter(g => g.employeeId === empId)
  const sheetForEmployee = (empId) => sheets.find(s => s.employeeId === empId)
  const teamMembers = (mgrId) => users.filter(u => u.managerId === mgrId)

  // Actions / Workflows
  const approveSheet = (sheetId, managerId) => {
    setSheets(prev => prev.map(s => s.id === sheetId ? { ...s, status: 'approved', approvedBy: managerId, approvedAt: new Date().toISOString() } : s))
    // Also lock individual goals linked to the sheet
    const targetSheet = sheets.find(s => s.id === sheetId)
    if (targetSheet) {
      setGoals(prev => prev.map(g => g.employeeId === targetSheet.employeeId ? { ...g, status: 'approved', lockedAt: new Date().toISOString() } : g))
    }
  }

  const returnSheet = (sheetId, note, managerId) => {
    setSheets(prev => prev.map(s => s.id === sheetId ? { ...s, status: 'returned', returnNote: note } : s))
  }

  const setWindow = (windowKey, status) => {
    setCycle(prev => ({
      ...prev,
      windows: { ...prev.windows, [windowKey]: status }
    }))
  }

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = (userId) => {
    setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, read: true } : n))
  }

  return (
    <AppContext.Provider value={{
      users, currentUser, goals, sheets, cycle, audit, notifications, escalationRules,
      login, logout, goalsForEmployee, sheetForEmployee, teamMembers,
      approveSheet, returnSheet, setWindow, markNotificationRead, markAllRead
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within an AppProvider')
  return context
}
