'use client'

import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { FormButtonSubmit } from '@/components/form/button-submit'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { $axios } from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/lib/schemas/authSchema'
import { ResponseLogin } from '@/types/responses/login_response_type'

export const FormLogin = () => {
  const [isLoding, setLoading] = useState(false)
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (formData: LoginFormData) => {
    try {
      setLoading(true)
      const response = await $axios.post<ResponseLogin>('/auth/login', formData)
      const location = response.data.data.role.toLocaleLowerCase() == 'admin' ? '/dashboard/article' : '/landing/article'
      window.location.replace(location)
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

        <FormButtonSubmit isLoading={isLoding} label='Login' />
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
