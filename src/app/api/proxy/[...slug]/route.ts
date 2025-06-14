// app/api/proxy/[...slug]/route.ts
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
    credentials: 'include',
  }

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    fetchOptions.body = await req.text()
  }

  // ✅ Tambahkan query string dari req.nextUrl
  const searchParams = req.nextUrl.searchParams.toString()
  const targetUrl = `${BASE_API_URL}/api/${path}${searchParams ? `?${searchParams}` : ''}`

  try {
    const response = await fetch(targetUrl, fetchOptions)
    const contentType = response.headers.get('content-type') || ''

    if (!contentType.includes('application/json')) {
      const buffer = await response.arrayBuffer()
      return new NextResponse(buffer, {
        status: response.status,
        headers: response.headers,
      })
    }

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          code: response.status,
          message: data?.message || 'Something went wrong',
        },
        { status: response.status },
      )
    }

    return NextResponse.json(
      {
        code: response.status,
        message: 'success',
        data,
      },
      { status: response.status },
    )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      {
        code: 500,
        message: err.message || 'Internal Server Error',
      },
      { status: 500 },
    )
  }
}

// ✅ Context tidak perlu Promise. Perbaiki jadi object langsung:
export async function GET(req: NextRequest, { params }: { params: { slug?: string[] } }) {
  const path = params.slug?.join('/') || ''
  return proxyRequest(req, path)
}
export async function POST(req: NextRequest, { params }: { params: { slug?: string[] } }) {
  const path = params.slug?.join('/') || ''
  return proxyRequest(req, path)
}
export async function PUT(req: NextRequest, { params }: { params: { slug?: string[] } }) {
  const path = params.slug?.join('/') || ''
  return proxyRequest(req, path)
}
export async function PATCH(req: NextRequest, { params }: { params: { slug?: string[] } }) {
  const path = params.slug?.join('/') || ''
  return proxyRequest(req, path)
}
export async function DELETE(req: NextRequest, { params }: { params: { slug?: string[] } }) {
  const path = params.slug?.join('/') || ''
  return proxyRequest(req, path)
}
