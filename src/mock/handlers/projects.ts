import { http, HttpResponse } from 'msw'
import { SEED_PROJECTS } from '../seed'
import type { Project, CreateProjectDto, UpdateProjectDto } from '@/types'
import { nanoid } from 'nanoid'

let projects: Project[] = [...SEED_PROJECTS]

export const projectHandlers = [
  // GET /api/projects
  http.get('/api/projects', () => HttpResponse.json(projects)),

  // GET /api/projects/:id
  http.get('/api/projects/:id', ({ params }) => {
    const project = projects.find((p) => p.id === params.id)
    if (!project) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(project)
  }),

  // POST /api/projects
  http.post('/api/projects', async ({ request }) => {
    const dto = (await request.json()) as CreateProjectDto
    const now = new Date().toISOString()
    const newProject: Project = {
      id: `p-${nanoid(6)}`,
      name: dto.name,
      description: dto.description,
      status: 'active',
      color: dto.color ?? '#7AFFA1',
      emoji: dto.emoji,
      ownerId: 'u-1',
      memberIds: ['u-1'],
      taskCount: 0,
      completedTaskCount: 0,
      dueDate: dto.dueDate,
      createdAt: now,
      updatedAt: now,
    }
    projects = [...projects, newProject]
    return HttpResponse.json(newProject, { status: 201 })
  }),

  // PATCH /api/projects/:id
  http.patch('/api/projects/:id', async ({ params, request }) => {
    const dto = (await request.json()) as UpdateProjectDto
    const idx = projects.findIndex((p) => p.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    const updated = { ...projects[idx], ...dto, updatedAt: new Date().toISOString() }
    projects = projects.map((p) => (p.id === params.id ? updated : p))
    return HttpResponse.json(updated)
  }),

  // DELETE /api/projects/:id
  http.delete('/api/projects/:id', ({ params }) => {
    const exists = projects.some((p) => p.id === params.id)
    if (!exists) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    projects = projects.filter((p) => p.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
]
