/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { $axios } from '@/lib/axios'
import { DetailArticle, ResponseListArticle } from '@/types/responses/article_response_type'
import { DetailCategory, ResponseListCategory } from '@/types/responses/category_response_type'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { SkeletonCardArticle } from '@/components/skeleton/card-article'

import { DynamicPagination } from '@/components/dynamic-pagination'
import { ArticleCard } from '@/components/article/card'
import { ArticleNoDataFound } from '@/components/article/no-data-found'
import { ConditionalView, If, Else, ElseIf } from '@/components/conditional-view'

export default function ListArticles() {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<DetailArticle[]>([])
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
      setOptions(response.data.data.data)
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
      setData(response.data.data.data)
      setTotal(response.data.data.total)
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
      <Card className='mb-4 md:mb-6 sticky top-20'>
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
                  {
                    options && options.map((option, i) => {
                      if (option.id.length) {
                        return (
                          <SelectItem key={i} value={option.id}>{option.name}</SelectItem>
                        )
                      }
                    })
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConditionalView condition={[isLoading, data.length === 0]}>
        {/* isLoading true */}
        <If>
          <div className="grid grid-cols-12 gap-4 md:gap-8">
            {
              Array.from({ length: 11 }).map((_, index) => (
                <div key={index} className='col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 2xl:col-span-2'>
                  <SkeletonCardArticle />
                </div>
              ))
            }
          </div>
        </If>
        
        {/* condition data.length === 0 */}
        <ElseIf>
          <ArticleNoDataFound />
        </ElseIf>

        <Else>
          <div className="grid grid-cols-12 gap-4 md:gap-8 mb-8">
            {
              data.map((article, i) => (
                <div key={i} className='col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 2xl:col-span-2'>
                  <ArticleCard detail={article}/>
                </div>
              ))
            }
          </div>

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
