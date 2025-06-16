'use client'

import { useCallback, useEffect, useState } from 'react'
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
import ImageInputPreview from '@/components/image-input-preview'

import { useProfileStore } from '@/store/profile-store'
import { ResponseRegister } from '@/types/responses/upload_response_type'
import { ResponseCreateArticle, PreviewDataArticle } from '@/types/responses/article_response_type'
import { ResponseListCategory, DetailCategory } from '@/types/responses/category_response_type'
import { TextEditor } from '@/components/text-edior'
import { ConditionalView, Else, If } from '@/components/conditional-view'
import ArticlePreview from '@/components/article/preview'

export default function Page() {
  const router = useRouter()
  const profileStore = useProfileStore((state) => state)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isPreview, setPreview] = useState<boolean>(false)
  const [options, setOptions] = useState<DetailCategory[]>([])
  const [data, setData] = useState<PreviewDataArticle>({
    title: '',
    content: '',
    imageUrl: '',
    username: '',
    createdAt: new Date().toISOString(),
  })

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      content: '',
      categoryId: '',
      imageFile: undefined,
    },
  })

  const onFileChange = (file: File | null) => {
    form.setValue('imageFile', file as File, {
      shouldValidate: true,
    })
  }

  const handlePreviewChange = useCallback((url: string | null) => {
    setData((prev) => ({
      ...prev,
      imageUrl: url,
    }))
  }, [])

  const onSubmit = async (formData: ArticleFormData) => {
    if (!isPreview) {
      setPreview(true)
      setData((prev) => ({
        ...prev,
        title: formData.title,
        content: formData.content,
        username: profileStore.username,
      }))

      return
    }
    
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
              <ConditionalView condition={[isPreview]}>
                <If>
                  <ArticlePreview
                    title={data.title}
                    imageUrl={data.imageUrl}
                    content={data.content}
                    createdAt={data.createdAt}
                    username={data.username}
                  />

                  <div className='space-x-4 flex items-center'>
                    <Button 
                      type='button'
                      variant="destructive"
                      onClick={() => setPreview(false)}
                    >
                      Cancel
                    </Button>

                    <FormButtonSubmit 
                      isLoading={isLoading} 
                      label='Create'
                    />
                  </div>  
                </If>

                <Else>
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
                    render={({ field, formState }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <TextEditor 
                            isError={!!formState.errors.content}
                            value={field.value} 
                            onChange={field.onChange}
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
                        <ImageInputPreview 
                          onFileChange={onFileChange}
                          onPreviewUrlChange={handlePreviewChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='space-x-4 flex items-center'>
                    <Button 
                      type='button'
                      variant="secondary"
                      onClick={() => router.back()}
                    >
                      Back
                    </Button>

                    <FormButtonSubmit 
                      isLoading={isLoading} 
                      label='Preview'
                    />
                  </div>
                </Else>
              </ConditionalView>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
