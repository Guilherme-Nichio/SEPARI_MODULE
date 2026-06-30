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
import './styles/v49-additions.css'
import './styles/v50-additions.css'
import './styles/v51-refresh.css'
import './styles/v52-polish.css'
import './styles/v53-home.css'
import './styles/v54-sobre.css'
import './styles/v55-pages.css'
import './styles/v56-tweaks.css'
import './styles/v57-produtos.css'
import './styles/v58-pecas.css'
import './styles/v59-polish.css'
import './styles/v60-megamenu.css'
import './styles/v61-rotary.css'
import './styles/v62-catalog.css'
import './styles/v63-updates.css'
import './styles/v64-fixes.css'
import './styles/v65-clean.css'
import './styles/v66-revamp.css'
import './styles/v67-revamp2.css'
import './styles/v68-home-font-test.css'

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
