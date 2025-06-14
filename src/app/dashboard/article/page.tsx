import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Article',
}

export default async function Page() {
  return (
    <div>
      <h1>Article</h1>
    </div>
  )
}
