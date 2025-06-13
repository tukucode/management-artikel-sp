/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { BASE_API_URL } from '@/constants/variables_const'

async function proxyRequest(req: NextRequest, path: string) {
  const method = req.method
  const headers = new Headers(req.headers)

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  }

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    fetchOptions.body = await req.text()
  }

  const targetUrl = `${BASE_API_URL}/api/${path}`

  try {
    const response = await fetch(targetUrl, fetchOptions)
    const contentType = response.headers.get('content-type') || ''

    // Jika bukan JSON, kirimkan raw
    if (!contentType.includes('application/json')) {
      const buffer = await response.arrayBuffer()
      return new NextResponse(buffer, {
        status: response.status,
        headers: response.headers,
      })
    }

    const data = await response.json()

    // Tangani status error dari API pihak ketiga
    if (!response.ok) {
      const errorMessage =
    data?.error || data?.message || 'Oops, something went wrong'

      return NextResponse.json(
        {
          code: response.status,
          error: errorMessage,
        },
        { status: response.status },
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error?.error  || 'Unknown error',
      },
      { status: 500 },
    )
  }
}

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxyRequest(req, params.slug.join('/'))
}
export async function POST(req: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxyRequest(req, params.slug.join('/'))
}
export async function PUT(req: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxyRequest(req, params.slug.join('/'))
}
export async function PATCH(req: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxyRequest(req, params.slug.join('/'))
}
export async function DELETE(req: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxyRequest(req, params.slug.join('/'))
}
