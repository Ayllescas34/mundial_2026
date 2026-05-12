import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'

import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 30, retry: 1 },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />

        <Analytics />

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#072010',
              color: '#86efac',
              border: '1px solid rgba(74,222,128,0.15)',
              borderRadius: '12px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)