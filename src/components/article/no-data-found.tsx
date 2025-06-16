import React from 'react'
import { Database } from 'lucide-react'

export function ArticleNoDataFound() {
  return (
    <div className="text-muted-foreground flex flex-col justify-center items-center h-[600px]">
      <div className='flex justify-center'>
        <Database className="h-10 w-10" />
      </div>
      <span className="block text-md font-semibold mt-2">No data found</span>
    </div>
  )
}
