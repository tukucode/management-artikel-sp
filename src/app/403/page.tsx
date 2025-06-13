'use client'

import Cookies from 'js-cookie'
import { Button } from '@/components/ui/button'

export default function ForbiddenPage() {
  const onClearCookies = () => {
    Cookies.remove('token')
    Cookies.remove('role')
    window.location.replace('/')
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">403 - Forbidden</h1>
      
      <p className="my-4 text-lg">
        You don’t have permission to access this page.
      </p>

      <Button onClick={onClearCookies}>
        go to Login
      </Button>
    </div>
  )
}