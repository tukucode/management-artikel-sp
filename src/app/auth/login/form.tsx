'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { $axios } from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { FormButtonSubmit } from '@/components/button-submit'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { loginSchema, LoginFormData } from '@/lib/schemas/authSchema'

export const FormLogin = () => {
  const router = useRouter()
  const [isLoding, setLoading] = useState(false)
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (formData: LoginFormData) => {
    setLoading(true)
    try {
      await $axios.post('/auth/login', formData)
      router.push('/articles')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form id='form__register' onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormButtonSubmit isLoading={isLoding} label='Login' block />
        <p className='text-center'>
          Don&apos;t have an account yet? {' '}
          <Link href="/auth/register" className='font-bold'>
            Register
          </Link>
        </p>
      </form>
    </Form>
  )
}
