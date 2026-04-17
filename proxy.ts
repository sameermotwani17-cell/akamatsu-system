import { NextRequest, NextResponse } from "next/server";

/**
 * Lightweight locale middleware.
 * Reads the `locale` cookie and passes it as a header so
 * next-intl's getRequestConfig can pick it up.
 */
export function proxy(request: NextRequest) {
  const locale = request.cookies.get("locale")?.value ?? "ja";
  const validLocale = ["ja", "en"].includes(locale) ? locale : "ja";

  // Pass locale downstream as a request header for next-intl request config.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", validLocale);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|products/|.*\\..*).+)",
  ],
};
