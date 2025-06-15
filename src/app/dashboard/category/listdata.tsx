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
import { FormNewCategory } from './form-new-category'
import { FormEditCategory } from './form-edit-category'

interface QueryParams {
  search: string
  page: number
  limit: number
}

export function ListData() {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<DetailCategory[]>([])
  const [total, setTotal] = useState<number>(0)
  const [params, setParams] =  useState<QueryParams>({
    search: '',
    page: 1,
    limit: 10,
  })

  const debouncedSearch = useDebounce(params.search)
  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }))
  }

  const fetchCategories = async () => {  
    try {
      setLoading(true)
      const response = await $axios.get<ResponseListCategory>('/categories', {
        params,
      })
      setData(response.data.data.data)
      setTotal(response.data.data.totalData)
    } catch (error) {
      console.error('ERROR', error)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const onDeleteCategory = async (id: string) => {
    try {
      setLoading(true)
      await $axios.delete(`/categories/${id}`)
      await fetchCategories()
    } catch (error) {
      console.error('ERROR', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [debouncedSearch, params.page, params.limit])

  return (
    <div id="list__data__category" className='space-y-6'>
      <Card>
        <CardContent>
          <div className='grid grid-cols-12 gap-4'>
            <div className="col-span-12 sm:col-span-9 md:col-span-8 lg:col-span-10">
              <Input 
                placeholder='Search...' 
                value={params.search}
                onChange={(e) => {
                  setParams((prev) => ({
                    ...prev,
                    search: e.target.value,
                    page: 1,
                  }))
                }} />
            </div>

            <div className='col-span-12 sm:col-span-3 md:col-span-4 lg:col-span-2'>
              <FormNewCategory onLoadData={() => fetchCategories()} />
            </div>
          </div>
          
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
                        <FormEditCategory 
                          categoryId={row.id} 
                          categoryName={row.name} 
                          onLoadData={() => fetchCategories()} 
                        />
                        
                        <Button 
                          variant="destructive" 
                          onClick={() => onDeleteCategory(row.id)}
                        >
                          Delete
                        </Button>
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
