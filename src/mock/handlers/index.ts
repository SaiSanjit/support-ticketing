import { authHandlers } from './auth'
import { taskHandlers } from './tasks'
import { projectHandlers } from './projects'

export const handlers = [...authHandlers, ...taskHandlers, ...projectHandlers]
