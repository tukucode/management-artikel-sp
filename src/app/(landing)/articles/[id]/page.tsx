/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Image from 'next/image'
import { $axios } from '@/lib/axios'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

import { FileImage } from 'lucide-react'
import { ArticleCard } from '@/components/article/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ConditionalView, If, Else } from '@/components/conditional-view'

import { formatDateTime, getInitialAvatar } from '@/lib/utils'
import { ApiResponse } from '@/types/responses/base_response_type'
import { ResponseListArticle, DetailArticle } from '@/types/responses/article_response_type'

export default function Page() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [isLoading, setLoading] = useState<boolean>(true)
  const [datas, setDatas] = useState<DetailArticle[]>([])
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

      setDatas(resArticles.data.data.data)
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
          <h1 className='text-6xl'>loading</h1>
        </If>

        <Else>
          <h1 className='text-2xl md:text-4xl font-bold capitalize text-center'>
            {detail.title}
          </h1>

          <div className='flex items-center gap-x-2'>
            <div className='flex items-center gap-x-2'>
              <Avatar>
                <AvatarFallback>
                  {getInitialAvatar(detail.user?.username || '')}
                </AvatarFallback>
              </Avatar>
          
              <span className='text-sm font-medium'>{detail.user?.username}</span> 
            </div>
            {'-'}
            <p className='text-xs text-muted-foreground'>
              {formatDateTime(detail.createdAt!)}
            </p>
          </div>

          <div className='w-full h-[300px] md:h-[600px] bg-muted-foreground flex items-center justify-center mt-6 mb-4'>
            <ConditionalView condition={[!!detail.imageUrl]}>
              <If>
                <Image 
                  src={detail.imageUrl!} 
                  loader={({ src }) => src} 
                  unoptimized 
                  alt={detail.title!}
                  width='150'
                  height='300'
                  className='rounded-lg object-cover w-full h-full' 
                /> 
              </If>

              <Else>
                <FileImage className='w-8 md:w-20 h-8 md:h-20' />
              </Else>
            </ConditionalView>
          </div>

          <article className="prose prose-lg mt-6 max-w-none">
            <div dangerouslySetInnerHTML={{ __html: detail.content! }} />
          </article>
        </Else>
      </ConditionalView>

      <ConditionalView condition={[!!datas.length]}>
        <If>
          <div className="grid grid-cols-12 gap-4 my-8">
            <div className='col-span-12'>
              <h3 className='text-base md:text-lg font-bold'>
                        It&apos;s being talked about a lot, so it&apos;s worth reading after this article.
              </h3>
            </div>
            {
              datas.map((data, i) => (
                <div key={i} className='col-span-12 sm:col-span-6 md:col-span-4'>
                  <ArticleCard detail={data} />
                </div>
              ))
            }
          </div>
        </If>
      </ConditionalView>
    </article>
  )
}
