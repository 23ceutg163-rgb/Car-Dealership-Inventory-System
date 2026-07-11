import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import { AuthProvider } from '@/context/AuthContext'
import queryClient from '@/lib/queryClient'
import ErrorBoundary from '@/components/shared/ErrorBoundary'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Global error boundary — catches any React rendering crash */}
    <ErrorBoundary>
      {/* Auth state — must wrap everything so routes can read auth */}
      <AuthProvider>
        {/* TanStack Query — server state management */}
        <QueryClientProvider client={queryClient}>
          {/* React Router */}
          <BrowserRouter>
            <App />
          </BrowserRouter>

          {/* Sonner toast notifications — rendered outside router so they overlay everything */}
          <Toaster
            position="top-right"
            richColors
            expand={false}
            duration={4000}
            toastOptions={{
              style: {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.875rem',
              },
            }}
          />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
)
