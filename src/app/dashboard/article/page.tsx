// import { $axios } from '@/lib/axios'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Article',
}

// async function fetchPosts(): Promise<any[]> {
//   const response = await $axios.get('/articles')
//   return response.data.data
// }


export default async function Page() {
  // const posts = await fetchPosts()

  return (
    <div>
      <h1>Article</h1>
    </div>
  )
}
