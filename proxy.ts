import { NextRequest, NextResponse } from "next/server";

/**
 * Lightweight locale middleware.
 * Reads the `locale` cookie and passes it as a header so
 * next-intl's getRequestConfig can pick it up.
 */
export function proxy(request: NextRequest) {
  const locale = request.cookies.get("locale")?.value ?? "ja";
  const validLocale = ["ja", "en"].includes(locale) ? locale : "ja";

  const response = NextResponse.next();
  response.headers.set("x-locale", validLocale);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|products/|.*\\..*).+)",
  ],
};
