import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set: (cookieOptions: { name: string; value: string; options?: Record<string, unknown> }) => {
          request.cookies.set({
            name: cookieOptions.name,
            value: cookieOptions.value,
            ...cookieOptions.options,
          });
          response.cookies.set({
            name: cookieOptions.name,
            value: cookieOptions.value,
            ...cookieOptions.options,
          });
        },
        remove: (cookieOptions: { name: string; options?: Record<string, unknown> }) => {
          request.cookies.set({
            name: cookieOptions.name,
            value: '',
            ...cookieOptions.options,
          });
          response.cookies.set({
            name: cookieOptions.name,
            value: '',
            ...cookieOptions.options,
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/create/:path*',
    '/templates/:path*',
    '/admin/:path*',
    '/member/:path*',
    '/api/templates/:path*',
    '/api/profile/:path*',
    '/api/payment/:path*',
    '/api/admin/:path*',
  ],
};
