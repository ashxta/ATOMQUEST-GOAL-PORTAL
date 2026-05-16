import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { AppProvider } from './store/AppContext.jsx'
import './index.css'

// HashRouter is used so the SPA works on any static host (GitHub Pages, S3)
// without server-side rewrite rules — keeps hosting cost at zero.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </HashRouter>
  </React.StrictMode>
)
