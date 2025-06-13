import React from 'react'
import { Loader2Icon } from 'lucide-react'
import { Button } from '../ui/button'

type PropFormButtonSubmit = {
  isLoading: boolean
  label: string
}
export const FormButtonSubmit = ({ isLoading, label }: PropFormButtonSubmit) => {
  return (
    <Button disabled={isLoading} type="submit" className="w-full">
      { isLoading && <Loader2Icon className="animate-spin" /> } 
      { label }
    </Button>
  )
}
