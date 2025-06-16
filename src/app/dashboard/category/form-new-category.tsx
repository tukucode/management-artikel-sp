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
  onLoadData: () => void
}

export function FormNewCategory({ onLoadData }: PropsFormNewCategory) {
  const [open, setOpen] = useState(false)
  const [isLoding, setLoading] = useState(false)

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (formData: CategoryFormData) => {    
    try {
      setLoading(true)
      await $axios.post('/categories', formData)
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
        className='w-full'
        onClick={() => {
          form.reset()
          setOpen(true)
        }}
      >
        Create New
      </Button>

      <DialogCategory 
        title="Create New Category" 
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

              <FormButtonSubmit isLoading={isLoding} label='Create' />
            </div>
          </form>
        </Form>
      </DialogCategory>
    </>
  )
}
