/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { $axios } from '@/lib/axios'
import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DynamicPagination } from '@/components/dynamic-pagination'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Database, FileImage, Loader2Icon } from 'lucide-react'

import { useProfileStore } from '@/store/profile-store'
import { ResponseListArticle, DetailArticle } from '@/types/responses/article_response_type'
import { ResponseListCategory, DetailCategory } from '@/types/responses/category_response_type'
import { Badge } from '@/components/ui/badge'
import { ConditionalView, Else, If } from '@/components/conditional-view'
import { Each, Empty, LoopView } from '@/components/loop-view'
 
interface QueryParamArticle {
  title: string
  userId: string
  category: string
  page: number
  limit: number
}

export function ListData() {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<DetailArticle[]>([])
  const [options, setOptions] = useState<DetailCategory[]>([])
  const [total, setTotal] = useState<number>(0)
  const [params, setParams] =  useState<QueryParamArticle>({
    title: '',
    userId: '',
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

  // get userId from store profile for filter data
  const userId = useProfileStore((state) => state.id)
  const fetchArticles = async () => {      
    try {
      setLoading(true)
      const response = await $axios.get<ResponseListArticle>('/articles', {
        params: {
          ...params,
          userId: params.userId == 'personal' ? userId : '',
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

  const onDeleteArticle = async (id: string) => {
    try {
      setLoading(true)
      await $axios.delete(`/articles/${id}`)
      await fetchArticles()
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
  }, [debouncedSearch, params.userId, params.category, params.page, params.limit])
  
  return (
    <div id="list__data__aticles" className='space-y-6'>
      <Card>
        <CardContent>
          <div className='grid grid-cols-12 gap-4'>
            <div className="col-span-12 md:col-span-6">
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

            <div className="col-span-12 md:col-span-2">
              <Select
                value={params.userId}
                onValueChange={(value) => setParams((prev) => ({
                  ...prev,
                  userId: value,
                  page: 1,
                }))}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-12 md:col-span-2">
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

            <div className='col-span-12 md:col-span-2'>
              <Button
                className='w-full'
                asChild
              >
                <Link href="/dashboard/article/new">Create New</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="max-w-full overflow-x-auto">
            <Table className="table-fixed w-full text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className='w-1/4 md:w-1/4'>Source</TableHead>
                  <TableHead className='w-1/2'>Title</TableHead>
                  <TableHead className='w-1/2'>Content</TableHead>
                  <TableHead className="w-1/2 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <ConditionalView condition={[isLoading]}>
                  <If>
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                        <div className='flex justify-center'>
                          <Loader2Icon className="animate-spin h-10 w-10" />
                        </div>
                        <span className="block text-sm mt-2">Loading...</span>
                      </TableCell>
                    </TableRow>
                  </If>

                  <Else>
                    <LoopView of={data}>
                      <Empty>
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                            <div className='flex justify-center'>
                              <Database className="h-10 w-10" />
                            </div>
                            <span className="block text-sm mt-2"> No data found.</span>
                          </TableCell>
                        </TableRow>
                      </Empty>

                      <Each>
                        {(article: DetailArticle, i: number) => (
                          <TableRow key={i}>
                            <TableCell className='w-1/2 space-y-2'>
                              <ConditionalView condition={[!!article.imageUrl]}>
                                <If>
                                  <Image src={article.imageUrl} loader={({ src }) => src} unoptimized alt={`image-${i}`} width="96" height="64" className='rounded-lg object-contain bg-center' />
                                </If>

                                <Else>
                                  <div className='w-24 h-16 bg-muted-foreground flex items-center justify-center rounded-lg'>
                                    <FileImage />
                                  </div>
                                </Else>
                              </ConditionalView>
  
                              <Badge variant='secondary' className='whitespace-normal leading-normal break-words line-clamp-1'>
                                { article.category.name }
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium truncate">{ article.title }</TableCell>
                            <TableCell className="font-medium truncate">{ article.content }</TableCell>
                            <TableCell className="text-right space-x-4">
                              <Button>
                                <Link href={`/dashboard/article/edit/${article.id}`}>Edit</Link>
                              </Button>
                              <Button variant="destructive" onClick={() => onDeleteArticle(article.id)}>Delete</Button>
                            </TableCell>
                          </TableRow>
                        )}
                      </Each>
                    </LoopView>
                  </Else>
                </ConditionalView>
              </TableBody>
            </Table>
          </div>
        
          <DynamicPagination
            totalItems={total}
            itemsPerPage={params.limit}
            currentPage={params.page}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </div>
  )
}
