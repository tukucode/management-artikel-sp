import React from 'react'
import { Label} from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FormFieldProps } from '@/types/form/field_type'


export const FormField = <T extends Record<string, unknown>>({
  label,
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
}: FormFieldProps<T>) => {
  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        {...register(name, { valueAsNumber })}
      />
    
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </>
  )
}
 
