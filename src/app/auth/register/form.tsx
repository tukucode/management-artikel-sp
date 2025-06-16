'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { FormButtonSubmit } from '@/components/button-submit'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { $axios } from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { Role  } from '@/types/role_type'
import { registerSchema, RegisterFormData } from '@/lib/schemas/authSchema'

export const FormRegister = () => {
  const router = useRouter()
  const [isLoding, setLoading] = useState(false)
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      role: undefined,
    },
  })

  const onSubmit = async (formData: RegisterFormData) => {
    try {
      setLoading(true)
      await $axios.post('/auth/register', formData)
      router.push('/auth/login')
    } catch {
      toast.error('The entered credentials are already in use. Please try different ones.')
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

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl className='w-full'>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={Role.User}>User</SelectItem>
                  <SelectItem value={Role.Admin}>Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormButtonSubmit isLoading={isLoding} label='Register' block />
        <p className='text-center'>
          Alredy have an account? {' '}
          <Link href="/auth/login" className='font-bold'>
            Login
          </Link>
          .
        </p>
      </form>
    </Form>
  )
}
