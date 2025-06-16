import { ApiResponsePagination } from '@/types/responses/base_response_type'
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

export type PreviewDataArticle = Pick<DetailArticle, 'title' | 'content' | 'createdAt'> & {
  imageUrl: string | null
  username: string
}
export type ResponseListArticle = ApiResponsePagination<DetailArticle[]>
export type ResponseCreateArticle = Omit<DetailArticle, 'category' | 'user'>
export type ResponseDetailArticle = Omit<DetailArticle, 'user'>
export type ResponseEditArticle = Omit<DetailArticle, 'category' | 'user'>