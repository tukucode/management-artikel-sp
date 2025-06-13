'use client'

import Link from 'next/link'
import { useState } from 'react'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { $axios } from '@/lib/axios'
import { FormButtonSubmit } from '@/components/form/button-submit'
import { FormField } from '@/components/form/field'
import { Role  } from '@/types/role_type'
import { FormDataAuth, registerSchema } from '@/lib/schemas/authSchema'

export const RegisterForm = () => {
  const [isLoding, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataAuth>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (formData: FormDataAuth) => {
    try {
      setLoading(true)
      await $axios.post('/auth/register', {
        ...formData,
        role: Role.User,
      })

      redirect('/auth/login')
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
          <FormButtonSubmit isLoading={isLoding} label='Register' />
          <p>
            Alredy have an account? {' '}
            <Link href="/auth/login" className='text-blue-500'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </form>
  )
}
