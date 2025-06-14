/* eslint-disable react-hooks/exhaustive-deps */
'use client'

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
import { ResponseListCategory, DetailCategory } from '@/types/responses/category_response_type'
import { $axios } from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Database, Loader2Icon } from 'lucide-react'

interface QueryParams {
  q: string
  page: number
  limit: number
}

export function ListData() {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<DetailCategory[]>([])
  const [total, setTotal] = useState<number>(0)
  const [params, setParams] =  useState<QueryParams>({
    q: '',
    page: 1,
    limit: 10,
  })

  const debouncedSearch = useDebounce(params.q)
  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }))
  }

  const fetchData = async () => {  
    try {
      setLoading(true)
      const response = await $axios.get<ResponseListCategory>('/categories', {
        params,
      })
      setData(response.data.data.data)
      setTotal(response.data.data.totalData)
    } catch (error) {
      console.log('ERRROR', error)
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
            value={params.q}
            onChange={(e) => {
              setParams((prev) => ({
                ...prev,
                q: e.target.value,
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
                <TableHead>Name</TableHead>
                <TableHead className="w-1/6 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                isLoading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-10">
                      <div className='flex justify-center'>
                        <Loader2Icon className="animate-spin h-10 w-10" />
                      </div>
                      <span className="block text-sm mt-2">Loading...</span>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-10 text-muted-foreground">
                      <div className='flex justify-center'>
                        <Database className="h-10 w-10" />
                      </div>
                      <span className="block text-sm mt-2"> No data found.</span>
                    </TableCell>
                  </TableRow>
                ) :
                  data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.name}</TableCell>
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
