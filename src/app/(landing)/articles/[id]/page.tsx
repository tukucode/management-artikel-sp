'use client'

import { useParams } from 'next/navigation'

export default function Page() {
  const { id } = useParams()
  return (
    <div>
      <h1>{id}</h1>
    </div>
  )
}
