/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { $axios } from '@/lib/axios'
import { useEffect, useState } from 'react'
import { useDebounce } from '@/hooks/use-debounce'
import { DetailArticle, ResponseListArticle } from '@/types/responses/article_response_type'
import { DetailCategory, ResponseListCategory } from '@/types/responses/category_response_type'

import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { SkeletonCardArticle } from '@/components/skeleton/card-article'
import { DynamicPagination } from '@/components/dynamic-pagination'
import { ArticleCard } from '@/components/article/card'
import { ArticleNoDataFound } from '@/components/article/no-data-found'
import { ConditionalView, If, Else } from '@/components/conditional-view'
import { LoopView, Each, Empty  } from '@/components/loop-view'


export default function ListArticles() {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [articles, setArticles] = useState<DetailArticle[]>([])
  const [options, setOptions] = useState<DetailCategory[]>([])
  const [total, setTotal] = useState<number>(0)
  const [params, setParams] =  useState({
    title: '',
    category: '',
    page: 1,
    limit: 10,
  })

  const debouncedSearch = useDebounce(params.title)
  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }))
  }

  const fetchCategories = async () => {  
    try {
      const response = await $axios.get<ResponseListCategory>('/categories?limit=100')      
      setOptions(response.data.data)
    } catch (error) {
      console.error('ERROR', error)
    }
  }

  const fetchArticles = async () => {      
    try {
      setLoading(true)
      const response = await $axios.get<ResponseListArticle>('/articles', {
        params: {
          ...params,
          category: params.category == 'all' ? '' : params.category,
        },
      })
      
      setArticles(response.data.data)
      setTotal(response.data.total)
    } catch (error) {
      console.error('ERROR', error)
    } finally {
      setLoading(false)
    }
  }

  // fetch API List categories
  useEffect(() => {
    fetchCategories()
  }, [])

  // fetch API list aticles
  useEffect(() => {
    fetchArticles()
  }, [debouncedSearch, params.category, params.page, params.limit])
    
  return (
    <div id='list__articles'>
      <Card className='mb-4 md:mb-6 sticky top-20 z-10'>
        <CardContent>
          <div className='grid grid-cols-12 gap-4'>
            <div className="col-span-8 sm:col-span-10">
              <Input 
                placeholder='Search...' 
                value={params.title}
                onChange={(e) => {
                  setParams((prev) => ({
                    ...prev,
                    title: e.target.value,
                    page: 1,
                  }))
                }} />
            </div>

            <div className="col-span-4 sm:col-span-2">
              <Select 
                value={params.category}
                onValueChange={(value) => setParams((prev) => ({
                  ...prev,
                  category: value,
                  page: 1,
                }))}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <LoopView of={options}>
                    <Each>
                      {(option: DetailCategory, i: number) => (
                        <SelectItem key={i} value={option.id || '-'}>{option.name}</SelectItem>
                      )}
                    </Each>
                  </LoopView>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConditionalView condition={[isLoading]}>
        {/* isLoading true */}
        <If>
          <div className="grid grid-cols-12 gap-4 md:gap-8">
            {
              Array.from({ length: 11 }).map((_, index) => (
                <div key={index} className='col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3'>
                  <SkeletonCardArticle />
                </div>
              ))
            }
          </div>
        </If>

        <Else>
          <LoopView of={articles}>
            <div className="grid grid-cols-12 gap-4 md:gap-8 mb-8">
              <Empty>
                <div className='col-span-12'>
                  <ArticleNoDataFound />
                </div>
              </Empty>

              <Each>
                {(article: DetailArticle, i: number) => (
                  <div key={i} className='col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3'>
                    <ArticleCard detail={article}/>
                  </div>
                )}
              </Each>
            </div>
          </LoopView>

          <DynamicPagination
            totalItems={total}
            itemsPerPage={params.limit}
            currentPage={params.page}
            onPageChange={handlePageChange}
          />
        </Else>
      </ConditionalView>
    </div>
  )
}
