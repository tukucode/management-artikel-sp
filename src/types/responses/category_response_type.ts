import { ApiResponse } from '@/types/responses/base_response_type'

export interface DetailCategory {
  id: string
  userId: string
  name: string
  createdAt: string
  updatedAt: string
}

export type ResponseListCategory = ApiResponse<DetailCategory[]> & {
  totalData: number
  currentPage: number
  totalPages: number
}
