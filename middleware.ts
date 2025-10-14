import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login");

    // If no token and trying to access protected routes, redirect to login
    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // If has token and trying to access login page, redirect to dashboard
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|api|favicon.ico).*)"],
};
