'use client'

import Link from 'next/link'
import { useState } from 'react'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { $axios } from '@/lib/axios'
import { FormButtonSubmit } from '@/components/form/button-submit'
import { FormField } from '@/components/form/field'
import { FormDataAuth, authSchema } from '@/lib/schemas/authSchema'
import { ResponseLogin } from '@/types/responses/login_response_type'

export const FormLogin = () => {
  const [isLoding, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataAuth>({
    resolver: zodResolver(authSchema),
  })

  const onSubmit = async (formData: FormDataAuth) => {
    try {
      setLoading(true)
      await $axios.post<ResponseLogin>('/auth/login', formData)
      redirect('/landing/article')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form id='form__register' onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <FormField<FormDataAuth>
            label="username"
            type="text"
            name="username"
            register={register}
            error={errors.username}
          />
        </div>

        <div className="grid gap-2">
          <FormField<FormDataAuth>
            label="password"
            type="password"
            name="password"
            register={register}
            error={errors.password}
          />
        </div>

        <div className="grid gap-4 text-center">
          <FormButtonSubmit isLoading={isLoding} label='Login' />
          <p>
            Don&apos;t have an account? {' '}
            <Link href="/auth/register" className='text-blue-500'>
              Register
            </Link>
            .
          </p>
        </div>
      </div>
    </form>
  )
}
