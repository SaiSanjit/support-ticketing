import type { ApiResponse } from '@/types/api'

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const base = import.meta.env.VITE_API_URL ?? ''
  const url = `${base}${endpoint}`
  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  // Attach auth token if present
  const token = localStorage.getItem('flow_token')
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const res = await fetch(url, { ...options, headers })
    if (res.status === 204) return { success: true, data: undefined as T }
    const data = await res.json()
    if (!res.ok) {
      return { success: false, error: data.message || 'API error', code: data.code || String(res.status) }
    }
    return { success: true, data: data as T }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error', code: 'FETCH_ERROR' }
  }
}
