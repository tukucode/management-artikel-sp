import { z } from 'zod'
import { Role } from '@/types/role_type'

const usernameSchema = z
  .string()
  .min(3, { message: 'Username must be at least 3 characters' })
  .max(20, { message: 'Username must be at most 20 characters' })

const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(12, { message: 'Password must be at most 12 characters' })

export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
})

export const registerSchema = loginSchema.extend({
  role: z.nativeEnum(Role, { required_error: 'Role is required' }),
})

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;