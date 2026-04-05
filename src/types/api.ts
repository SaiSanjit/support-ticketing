export type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string; code: string }

export type PaginatedResponse<T> = ApiResponse<{
  items: T[],
  total: number,
  page: number,
  pageSize: number
}>
