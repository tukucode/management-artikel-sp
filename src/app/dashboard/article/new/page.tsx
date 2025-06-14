'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { $axios } from '@/lib/axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { FormButtonSubmit } from '@/components/button-submit'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { articleSchema, ArticleFormData } from '@/lib/schemas/articleSchema'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import ImageInputPreview from '@/components/image-input-preview'

import { ResponseRegister } from '@/types/responses/upload_response_type'
import { ResponseListCategory, DetailCategory } from '@/types/responses/category_response_type'
import { ResponseCreateArticle } from '@/types/responses/article_response_type'

export default function Page() {
  const router = useRouter()
  const [isLoding, setLoading] = useState<boolean>(false)
  const [options, setOptions] = useState<DetailCategory[]>([])

  const onFileChange = (file: File | null) => {
    form.setValue('imageFile', file as File, {
      shouldValidate: true,
    })
  }

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      content: '',
      categoryId: '',
      imageFile: undefined,
    },
  })

  const onSubmit = async (formData: ArticleFormData) => {
    setLoading(true)

    try {
      const fd = new FormData()
      fd.append('image', formData.imageFile)

      const uploadRes = await $axios.post<ResponseRegister>('/upload', fd)
      const imageUrl = uploadRes.data.data.imageUrl

      await $axios.post<ResponseCreateArticle>('/articles', {
        title: formData.title,
        content: formData.content,
        categoryId: formData.categoryId,
        imageUrl,
      })

      router.push('/dashboard/article')
    } catch (error) {
      console.error('ERROR', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {  
    try {
      setLoading(true)
      const response = await $axios.get<ResponseListCategory>('/categories?limit=100')
      setOptions(response.data.data.data)
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
  return (
    <div id='form__new__article'>
      <Card>
        <CardHeader>
          <CardTitle>Create New Article</CardTitle>
        </CardHeader>
      
        <CardContent>
          <Form {...form}>
            <form id='form__article' onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder='React JS' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Lorem ipsum..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageFile"
                render={() => (
                  <FormItem>
                    <ImageInputPreview onFileChange={onFileChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-12 gap-4'>
                <Button 
                  type='button'
                  variant="secondary" 
                  className='col-span-6 sm:col-span-3 md:col-span-2'
                  onClick={() => router.back()}
                >
                  Back
                </Button>

                <div className='col-span-6 sm:col-span-3 md:col-span-2'>
                  <FormButtonSubmit isLoading={isLoding} label='Create' />
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
