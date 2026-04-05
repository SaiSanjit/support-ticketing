import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './store/auth-store.ts'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
})

async function enableMocking() {
  // Only enable MSW when no real API URL is configured
  if (import.meta.env.VITE_API_URL) return
  const { worker } = await import('./mock/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

async function boot() {
  await enableMocking()
  // Hydrate auth state from localStorage (restores session on reload)
  await useAuthStore.getState().hydrate()

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>,
  )
}

boot()
