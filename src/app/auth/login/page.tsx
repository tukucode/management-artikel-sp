import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
}
export default function page() {
  return (
    <div>
      <h1>Login</h1>
      <Button asChild>
        <Link href="/article">
          Article
        </Link>  
      </Button>
    </div>
  )
}
