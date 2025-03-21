import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/login',
    },
  },
);

// ✅ Добавляем service-worker.js и install в исключения!
export const config = {
  matcher: [
    '/((?!login|signup|install|api/auth|api|_next/static|_next/image|favicon.ico|manifest.json|service-worker.js|icon-192x192.png|icon-512x512.png).*)',
  ],
};
