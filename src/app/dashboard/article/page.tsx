import type { Metadata } from 'next'
import { ListData } from './listdata'

export const metadata: Metadata = {
  title: 'Dashboard - Article',
}

export default async function Page() {
  return (
    <ListData />
  )
}
