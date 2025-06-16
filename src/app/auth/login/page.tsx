import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
} from '@/components/ui/card'
import { FormLogin } from './form'

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Login',
}

export default function Page() {
  return (
    <Card id='card__Login' className='w-xl'>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Please enter your username and password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormLogin />
      </CardContent>
    </Card>
  )
}
