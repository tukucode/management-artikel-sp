import { ApiResponse } from '@/types/responses/base_response_type'
import { Role } from '@/types/role_type'

export type ResponseRegister = ApiResponse<{
  id: string
  username: string
  role: Role
  password: string
  createdAt: Date
  updatedAt: Date
}>