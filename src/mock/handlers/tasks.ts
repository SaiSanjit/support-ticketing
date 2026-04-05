import { http, HttpResponse } from 'msw'
import { SEED_TASKS } from '../seed'
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types'
import { nanoid } from 'nanoid'

// Mutable in-memory store
let tasks: Task[] = [...SEED_TASKS]

export const taskHandlers = [
  // GET /api/tasks
  http.get('/api/tasks', ({ request }) => {
    const url = new URL(request.url)
    const projectId = url.searchParams.get('projectId')
    const status = url.searchParams.get('status')
    const assigneeId = url.searchParams.get('assigneeId')

    let result = [...tasks]
    if (projectId) result = result.filter((t) => t.projectId === projectId)
    if (status) result = result.filter((t) => t.status === status)
    if (assigneeId) result = result.filter((t) => t.assigneeId === assigneeId)

    return HttpResponse.json(result)
  }),

  // GET /api/tasks/:id
  http.get('/api/tasks/:id', ({ params }) => {
    const task = tasks.find((t) => t.id === params.id)
    if (!task) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(task)
  }),

  // POST /api/tasks
  http.post('/api/tasks', async ({ request }) => {
    const dto = (await request.json()) as CreateTaskDto
    const now = new Date().toISOString()
    const newTask: Task = {
      id: `t-${nanoid(6)}`,
      title: dto.title,
      description: dto.description,
      status: dto.status ?? 'todo',
      priority: dto.priority ?? 'medium',
      projectId: dto.projectId,
      assigneeId: dto.assigneeId,
      reporterId: 'u-1',
      tags: dto.tags ?? [],
      subtaskCount: 0,
      completedSubtaskCount: 0,
      commentCount: 0,
      attachmentCount: 0,
      order: tasks.filter((t) => t.projectId === dto.projectId).length,
      dueDate: dto.dueDate,
      createdAt: now,
      updatedAt: now,
    }
    tasks = [...tasks, newTask]
    return HttpResponse.json(newTask, { status: 201 })
  }),

  // PATCH /api/tasks/:id
  http.patch('/api/tasks/:id', async ({ params, request }) => {
    const dto = (await request.json()) as UpdateTaskDto
    const idx = tasks.findIndex((t) => t.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    const updated = { ...tasks[idx], ...dto, updatedAt: new Date().toISOString() }
    tasks = tasks.map((t) => (t.id === params.id ? updated : t))
    return HttpResponse.json(updated)
  }),

  // DELETE /api/tasks/:id
  http.delete('/api/tasks/:id', ({ params }) => {
    const exists = tasks.some((t) => t.id === params.id)
    if (!exists) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    tasks = tasks.filter((t) => t.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
]
