import { z } from 'zod'

export const categorySchema = z.object({
  name:z.string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(20, { message: 'Name must be at most 20 characters' }),
})


export type CategoryFormData = z.infer<typeof categorySchema>;