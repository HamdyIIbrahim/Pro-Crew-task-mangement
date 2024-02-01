import { NextResponse } from "next/server";
export function middleware(request) {
  const allCookies = request.cookies.get("token");
  if (allCookies) {
    return NextResponse.next();
  } else {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
}
export const config = {
  matcher: ["/about"],
};
