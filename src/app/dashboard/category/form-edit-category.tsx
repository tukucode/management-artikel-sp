'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { $axios } from '@/lib/axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { FormButtonSubmit } from '@/components/button-submit'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { categorySchema, CategoryFormData } from '@/lib/schemas/categorySchema'
import DialogCategory from './dialog-category'

type PropsFormNewCategory = {
  categoryId: string
  categoryName: string
  onLoadData: () => void
}

export function FormEditCategory({ 
  categoryId,
  categoryName,
  onLoadData,
}: PropsFormNewCategory) {
  const [open, setOpen] = useState(false)
  const [isLoding, setLoading] = useState(false)

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
    },
  })

  const onOpenDialog = () => {
    form.reset()
    form.setValue('name', categoryName)
    setOpen(true)
  }

  const onSubmit = async (formData: CategoryFormData) => {    
    if (!categoryId) return
    
    try {
      setLoading(true)
      await $axios.put(`/categories/${categoryId}`, formData)
      // function for fetch load data on parent component
      onLoadData()
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => onOpenDialog()}
      >
        Edit
      </Button>

      <DialogCategory 
        title="Edit Category" 
        open={open} 
        onOpenChange={setOpen}
      >
        <Form {...form}>
          <form id='form__create_category' onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        
            <div className="space-x-4 flex items-center">
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <FormButtonSubmit isLoading={isLoding} label='Update' />
            </div>
          </form>
        </Form>
      </DialogCategory>
    </>
  )
}
