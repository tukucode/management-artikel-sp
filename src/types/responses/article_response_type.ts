import { ApiResponse } from '@/types/responses/base_response_type'
import { DetailCategory } from '@/types/responses/category_response_type'

export interface DetailArticle {
  id: string
  userId: string
  categoryId: string
  title: string
  content: string
  imageUrl: string
  createdAt: string
  updatedAt: string
  category: DetailCategory
  user: {
    id: string
    username: string
  }
}

export type ResponseListArticle = ApiResponse<{
  data: DetailArticle[]
  page: number
  limit: number
  total: number
}>