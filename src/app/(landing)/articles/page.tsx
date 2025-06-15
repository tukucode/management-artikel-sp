import type { Metadata } from 'next'
import ListArticles from './list-articles'

export const metadata: Metadata = {
  title: 'Articles',
}

export default function page() {
  return (
    <ListArticles />
  )
}
