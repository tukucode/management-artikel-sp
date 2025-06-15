import React from 'react'
import { Loader2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PropFormButtonSubmit = {
  isLoading: boolean
  label: string
  block?: boolean
}
export const FormButtonSubmit = ({ 
  isLoading, 
  label,
  block,
}: PropFormButtonSubmit) => {
  return (
    <Button disabled={isLoading} type="submit" className={block ? 'w-full' : ''}>
      { 
        isLoading ?
          <>
            <Loader2Icon className="animate-spin" /> 
            Loading...
          </>
          :
          label
      } 
    </Button>
  )
}
