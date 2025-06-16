/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { $axios } from '@/lib/axios'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

import { ArticleCard } from '@/components/article/card'
import { Each, LoopView } from '@/components/loop-view'
import { ConditionalView, If, Else } from '@/components/conditional-view'
import { Skeleton } from '@/components/ui/skeleton'

import { ApiResponse } from '@/types/responses/base_response_type'
import { ResponseListArticle, DetailArticle } from '@/types/responses/article_response_type'
import { ArticlePreview } from '@/components/article/preview'

export default function Page() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [isLoading, setLoading] = useState<boolean>(true)
  const [articles, setArticles] = useState<DetailArticle[]>([])
  const [detail, setDetail] = useState<Partial<DetailArticle>>({})

  const id = params.id as string
  const categoryId = searchParams.get('categoryId')

  const fetchDataArticle = async () => {
    try {
      const resDetail =  await $axios.get<ApiResponse<DetailArticle>>(`/articles/${id}`)
      setDetail(resDetail.data.data)

      const resArticles = await $axios.get<ResponseListArticle>('/articles', {
        params: {
          category: categoryId,
          page: 1,
          limit: 3,
        },
      })

      setArticles(resArticles.data.data.data)
    } catch (error) {
      console.error('ERROR', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDataArticle()
  }, [id, categoryId])

  return (
    <article id='detail__article'>
      <ConditionalView condition={[isLoading]}>
        <If>
          <div className='space-y-4'>
            <Skeleton className='w-1/2 h-10 text-center' />
            <div className='flex items-center gap-x-4'>
              <Skeleton className='w-10 h-10 rounded-full' />
              <Skeleton className='w-40 h-6 text-center' />
            </div>
            <Skeleton className='w-full h-52 text-center' />
            <Skeleton className='w-1/6 h-6 text-center' />
            <Skeleton className='w-1/2 h-6 text-center' />
            <Skeleton className='w-1/4 h-6 text-center' />
          </div>
        </If>

        <Else>
          <ArticlePreview
            title={detail.title!}
            imageUrl={detail.imageUrl!}
            content={detail.content!}
            createdAt={detail.createdAt!}
            username={detail.user?.username || ''}
          />
        </Else>
      </ConditionalView>

      <LoopView of={articles}>
        <ConditionalView condition={[articles.length != 0]}>
          <If>
            <div className="grid grid-cols-12 gap-4 my-8">
              <div className='col-span-12'>
                <h3 className='text-base md:text-lg font-bold'>
              It&apos;s being talked about a lot, so it&apos;s worth reading after this article.
                </h3>
              </div>
              <Each>
                {(article: DetailArticle, i: number) => (
                  <div key={i} className='col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3'>
                    <ArticleCard detail={article}/>
                  </div>
                )}
              </Each>
            </div>
          </If>
        </ConditionalView>
      </LoopView>
    </article>
  )
}
