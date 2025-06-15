/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { $axios } from '@/lib/axios'
import { DetailArticle, ResponseListArticle } from '@/types/responses/article_response_type'
import { DetailCategory, ResponseListCategory } from '@/types/responses/category_response_type'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Database, FileImage } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { DynamicPagination } from '@/components/dynamic-pagination'

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
      <Card className='mb-6'>
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

      {
        isLoading ? 
          <div className="grid grid-cols-12 gap-4">
            {
              Array.from({ length: 11 }).map((_, index) => (
                <div key={index} className='col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 2xl:col-span-2'>
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-44" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 mb-2" />
                      <Skeleton className="h-4 mb-4" />
                      <Skeleton className="h-12" />
                    </CardContent>
                  </Card>
                </div>
              ))
            }
          </div>
          :
          <>
            {
              data.length === 0 ? 
                <div className="text-muted-foreground flex flex-col justify-center items-center h-[600px]">
                  <div className='flex justify-center'>
                    <Database className="h-10 w-10" />
                  </div>
                  <span className="block text-md font-semibold mt-2"> No data found</span>
                </div>
                : 
                <>
                  <div className="grid grid-cols-12 gap-4 mb-8">
                    {
                      data.map((data, i) => (
                        <div key={i} className='col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 2xl:col-span-2'>
                          <Card className='h-full'>
                            <CardHeader>
                              <div className='w-full h-44 bg-muted-foreground flex items-center justify-center rounded-lg'>
                                {
                                  data.imageUrl ? (
                                    <Image 
                                      src={data.imageUrl} 
                                      loader={({ src }) => src} 
                                      unoptimized alt={`image-${i}`} 
                                      width='100'
                                      height='176'
                                      className='rounded-lg object-cover w-full h-44' 
                                    />
                                  ) : (
                                    <FileImage />
                                  )
                                }
                              </div>
                            </CardHeader>
                            <CardContent className='space-y-2'>
                              <Badge variant="secondary">
                                {data.category.name || '-'}
                              </Badge>

                              <h3 className='font-semibold text-lg capitalize'>
                                {data.title || '-'}
                              </h3>             
                            </CardContent>
                            <CardFooter>
                              <Button asChild className='w-full'>
                                <Link href={`/articles/${data.id}`}>
                                Read More
                                </Link>  
                              </Button>      
                            </CardFooter>
                          </Card>
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
                </>
            }
          </>
      }
    </div>
  )
}
