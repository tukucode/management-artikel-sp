import { z } from 'zod'

export const articleSchema = z.object({
  title: z.string()
    .min(4, { message: 'Title must be at least 4 characters' })
    .max(100, { message: 'Title must be at most 100 characters' }),
  content: z.string()
    .min(100, {message: 'Content must be at least 100 characters'})
    .max(3000, { message: 'Content must be at most 3000 characters' }),
  categoryId: z.string().min(1, { message: 'Category is required'}),
  imageFile: z
    .custom<File>((val) => val instanceof File && val.size > 0, {
      message: 'Image is required',
    }),
})

export type ArticleFormData = z.infer<typeof articleSchema>;