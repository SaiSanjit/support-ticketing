import { http, HttpResponse } from 'msw'
import { SEED_USERS } from '../seed'
import type { User } from '@/types'
import { nanoid } from 'nanoid'

const DEMO_EMAIL = 'demo@flow.app'
const DEMO_PASSWORD = 'password'

// In-memory user store (starts with seed users)
const users: User[] = [...SEED_USERS]

function makeToken(user: User) {
  // Fake JWT-ish token: base64(userId) — fine for dev mocking
  return btoa(JSON.stringify({ sub: user.id, name: user.name, exp: Date.now() + 86_400_000 }))
}

function userFromToken(auth: string | null): User | null {
  if (!auth?.startsWith('Bearer ')) return null
  try {
    const payload = JSON.parse(atob(auth.slice(7)))
    return users.find((u) => u.id === payload.sub) ?? null
  } catch {
    return null
  }
}

export const authHandlers = [
  // POST /api/auth/login
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    if (body.email === DEMO_EMAIL && body.password === DEMO_PASSWORD) {
      const user = users.find((u) => u.email === DEMO_EMAIL)!
      return HttpResponse.json({ user, token: makeToken(user) })
    }
    // Allow any seeded user with same password
    const user = users.find((u) => u.email === body.email)
    if (user && body.password === DEMO_PASSWORD) {
      return HttpResponse.json({ user, token: makeToken(user) })
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }),

  // POST /api/auth/signup
  http.post('/api/auth/signup', async ({ request }) => {
    const body = (await request.json()) as { name: string; email: string; password: string }
    if (users.some((u) => u.email === body.email)) {
      return HttpResponse.json({ message: 'Email already in use' }, { status: 409 })
    }
    const now = new Date().toISOString()
    const newUser: User = {
      id: `u-${nanoid(6)}`,
      name: body.name,
      email: body.email,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(body.name)}`,
      role: 'member',
      createdAt: now,
      updatedAt: now,
    }
    users.push(newUser)
    return HttpResponse.json({ user: newUser, token: makeToken(newUser) }, { status: 201 })
  }),

  // GET /api/auth/me
  http.get('/api/auth/me', ({ request }) => {
    const user = userFromToken(request.headers.get('Authorization'))
    if (!user) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    return HttpResponse.json(user)
  }),
]
