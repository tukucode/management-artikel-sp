import { z } from 'zod'
import { Role } from '@/types/role_type'

export type FormDataAuth = {
  username: string
  password: string
  role?: Role
}

export const registerSchema = z.object({
  username: z.string().min(3, { message: 'Username minimal 3 karakter'}),
  password: z.string().min(1, { message: 'Password minimal 1 karakter' }),
})