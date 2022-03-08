
import {NextApiRequest} from 'next';
import {NextRequest, NextResponse} from 'next/server';
import {getToken} from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Token will exist if user is logged in
  const token = await getToken({req: req as unknown as NextApiRequest, secret: process.env.JWT_SECRET!});
  const {pathname} = req.nextUrl;

  // Allow requests if :
  // 1. request for next-auth session & provider fetching
  // 2. token exists
  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  // Otherwise, redirect to login
  // if asking for a protected route without token
  if (!token && pathname !== '/login') {
    // const url = req.nextUrl.clone()
    // url.pathname = '/login'
    // return NextResponse.rewrite(url)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
  }
}
