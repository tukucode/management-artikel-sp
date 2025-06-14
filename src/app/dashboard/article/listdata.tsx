/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Image from 'next/image'
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
import { Database, Loader2Icon } from 'lucide-react'
import { ResponseListArticle, DetailArticle } from '@/types/responses/article_response_type'


export function ListData() {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<DetailArticle[]>([])
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

  const fetchData = async () => {  
    try {
      setLoading(true)
      const response = await $axios.get<ResponseListArticle>('/articles', {
        params,
      })
      setData(response.data.data.data)
      setTotal(response.data.data.total)
    } catch (error) {
      console.error('ERRROR', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [debouncedSearch, params.page, params.limit])

  return (
    <div id="list__data__category" className='space-y-6'>
      <Card>
        <CardContent>
          <Input 
            placeholder='search...' 
            value={params.title}
            onChange={(e) => {
              setParams((prev) => ({
                ...prev,
                title: e.target.value,
                page: 1,
              }))
            }} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-1/6 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                      <div className='flex justify-center'>
                        <Loader2Icon className="animate-spin h-10 w-10" />
                      </div>
                      <span className="block text-sm mt-2">Loading...</span>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
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
                        <Image src={row.imageUrl} alt={`image-${index}`} width={100} height={100} className='rounded-lg' />
                      </TableCell>
                      <TableCell className="font-medium">{row.title}</TableCell>
                      <TableCell className="text-right space-x-4">
                        <Button variant="secondary">Edit</Button>
                        <Button variant="destructive">Delete</Button>
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
