import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login", // Указываем страницу логина
    },
  }
);

// Ограничиваем доступ ко всем страницам, кроме `/login` и API

export const config = {
  matcher: [
    "/((?!login|api/auth|api|_next/static|_next/image|favicon.ico|manifest.json|icon-192x192.png|icon-512x512.png).*)",
  ],
};

