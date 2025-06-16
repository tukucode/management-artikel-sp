'use client'

import Cookies from 'js-cookie'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import ProfileDropdown from '@/components/profile-dropdown'
import { APP_NAME } from '@/constants/variables_const'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  
  const [isLoading, setLoading] = useState<boolean>(true)
  const isLogin = useMemo(() => {
    const token = Cookies.get('token')
    return !!token
  }, [])
  
  useEffect(() => {
    setLoading(false)
  }, [])
  return (
    <div id='layout__landing'>
      <header className='sticky top-0 z-10 flex justify-between items-center h-16 px-4 py-8 bg-sidebar shadow'>
        <Link href="/articles">
          <h4 className='font-semibold text-lg'>{ APP_NAME }</h4>
        </Link>
  
        {
          isLoading ? 
            <div className='flex justify-between items-center'>
              <Skeleton className="h-6 w-20 me-4" />
              <Skeleton className="h-6 w-20" />
            </div> 
            : 
            isLogin ?
              <ProfileDropdown />
              : 
              <div className='space-x-4'>
                <Button variant='outline'>
                  <Link href='/auth/login'>Login</Link>
                </Button>
                <Button>
                  <Link href='/auth/register'>Register</Link>
                </Button>
              </div>
        }
      </header>

      <main className="py-10 px-4 bg-gray-100 dark:bg-muted-foreground/5 min-h-screen">
        {children}
      </main>
    </div>
  )
}
