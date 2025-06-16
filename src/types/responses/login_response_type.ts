import { ApiResponse } from '@/types/responses/base_response_type'
import { Role } from '@/types/role_type'

export type ResponseLogin = ApiResponse<{
  token: string
  role: Role
}>