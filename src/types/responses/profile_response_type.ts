import { ApiResponse } from '@/types/responses/base_response_type'
import { Role } from '@/types/role_type'

export interface DetailProfile {
  id: string
  username: string
  role: Role
  createdAt: Date
  updatedAt: Date
}

export type ResponseProfile = ApiResponse<DetailProfile>