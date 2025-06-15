/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Image from 'next/image'
import Link from 'next/link'
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
import { $axios } from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Database, FileImage, Loader2Icon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ResponseListArticle, DetailArticle } from '@/types/responses/article_response_type'
import { ResponseListCategory, DetailCategory } from '@/types/responses/category_response_type'
import { useProfileStore } from '@/store/profile-store'

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
    <div id="list__data__category" className='space-y-6'>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-1/6 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                      <div className='flex justify-center'>
                        <Loader2Icon className="animate-spin h-10 w-10" />
                      </div>
                      <span className="block text-sm mt-2">Loading...</span>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      <div className='flex justify-center'>
                        <Database className="h-10 w-10" />
                      </div>
                      <span className="block text-sm mt-2"> No data found.</span>
                    </TableCell>
                  </TableRow>
                ) :
                  data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {
                          row.imageUrl ? (
                            <Image src={row.imageUrl} loader={({ src }) => src} unoptimized alt={`image-${index}`} width="96" height="64" className='rounded-lg object-contain bg-center' />
                          ) : (
                            <div className='w-24 h-16 bg-muted-foreground flex items-center justify-center rounded-lg'>
                              <FileImage />
                            </div>
                          )
                        }
                      </TableCell>
                      <TableCell className="font-medium">{row.title || '-'}</TableCell>
                      <TableCell className="font-medium">{ row.content.length > 50 ? `${row.content.slice(0, 50)}...` : row.content }</TableCell>
                      <TableCell className="font-medium">{row.category.name || '-'}</TableCell>
                      <TableCell className="text-right space-x-4">
                        <Button>
                          <Link href={`/dashboard/article/edit/${row.id}`}>Edit</Link>
                        </Button>
                        <Button variant="destructive" onClick={() => onDeleteArticle(row.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        
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
