import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
} from '@/components/ui/card'
import { RegisterForm } from './form'

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Register',
}
export default function Page() {
  return (
    <Card id='card__register' className='w-xl'>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Let&apos;s start create new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  )
}
