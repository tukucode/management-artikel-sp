import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      
      <p className="my-4 text-lg">
        We apologize, but the page you are not looking for does not exist.
      </p>

      <Button asChild>
        <Link href="/">
          Back to Home
        </Link>
      </Button>
    </div>
  )
}