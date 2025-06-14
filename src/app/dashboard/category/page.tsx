import type { Metadata } from 'next'
import { ListData } from './listdata'

export const metadata: Metadata = {
  title: 'Dashboard - Category',
}

export default function Page() {
  return (
    <ListData />
  )
}
