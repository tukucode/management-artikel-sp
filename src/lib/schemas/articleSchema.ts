import { z } from 'zod'

export const articleSchema = z.object({
  title: z.string()
    .min(4, { message: 'Title must be at least 4 characters' })
    .max(20, { message: 'Title must be at most 20 characters' }),
  content: z.string()
    .min(10, {message: 'Content must be at least 10 characters'})
    .max(250, { message: 'Content must be at most 250 characters' }),
  categoryId: z.string().min(1, { message: 'Category is required'}),
  imageFile: z
    .custom<File>((val) => val instanceof File && val.size > 0, {
      message: 'Image is required',
    }),
})

export type ArticleFormData = z.infer<typeof articleSchema>;