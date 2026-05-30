import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './styles/globals.css'
import './styles/platform.css'
import './styles/v39-additions.css'
import './styles/v40-additions.css'
import './styles/v41-additions.css'
import './styles/v42-redesign.css'
import './styles/v43-final.css'
import './styles/v44-admin-redesign.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0F172A',
              color: '#fff',
              borderRadius: '12px',
              padding: '14px 18px',
              fontSize: '0.95rem',
              fontWeight: 500,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            },
            success: { iconTheme: { primary: '#00A99D', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
