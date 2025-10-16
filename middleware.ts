import { NextResponse } from "next/server";

export function middleware() {
    // Since we're using localStorage for token storage (client-side only),
    // we can't check authentication status in middleware (server-side).
    // Authentication checks will be handled on the client-side in components.

    // Just allow all requests to pass through
    // Client-side components will handle authentication checks
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|api|favicon.ico).*)"],
};
