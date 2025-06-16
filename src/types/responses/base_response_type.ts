export interface ApiResponse<T = unknown> {
  data: T
}

export type ApiResponsePagination<T = unknown> = ApiResponse<T> & {
  page: number
  per_page: number
  total: number
}