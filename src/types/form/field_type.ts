import { FieldError, Path, UseFormRegister } from 'react-hook-form'

export type FormFieldProps<T extends Record<string, unknown>> = {
  label: string
  type: string
  name: Path<T>
  placeholder?: string
  register: UseFormRegister<T>
  error: FieldError | undefined
  valueAsNumber?: boolean
}