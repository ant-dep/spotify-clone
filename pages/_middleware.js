import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  // Get the token from the header if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET })
  // destructure the pathname from the request
  const { pathname } = req.nextUrl

  // Allow requests if :
  // 1. request for next-auth session & provider fetching
  // 2. token exists
  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  // Otherwise, redirect to login
  // if asking for a protected route without token
  if (!token && pathname !== '/login') {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.rewrite(url)
  }
}
