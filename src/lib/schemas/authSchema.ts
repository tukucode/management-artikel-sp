import { z } from 'zod'
import { Role } from '@/types/role_type'

export type FormDataAuth = {
  username: string
  password: string
  role?: Role
}

export const authSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(20, { message: 'Username must be at most 20 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(12, { message: 'Password must be at most 12 characters' }),
})