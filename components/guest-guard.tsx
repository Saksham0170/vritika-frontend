"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/userStore"

interface GuestGuardProps {
    children: React.ReactNode
    fallback?: React.ReactNode
    redirectTo?: string
}

export function GuestGuard({
    children,
    fallback,
    redirectTo = "/dashboard"
}: GuestGuardProps) {
    const router = useRouter()
    const { isAuthenticated, token, hasHydrated } = useUserStore()

    useEffect(() => {
        // Only check authentication after store has hydrated from localStorage
        if (hasHydrated && isAuthenticated && token) {
            router.push(redirectTo)
        }
    }, [isAuthenticated, token, hasHydrated, router, redirectTo])

    // Show loading while store is hydrating
    if (!hasHydrated) {
        return (
            fallback || (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">Loading...</p>
                    </div>
                </div>
            )
        )
    }

    // If user is authenticated, show loading while redirecting
    if (isAuthenticated && token) {
        return (
            fallback || (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">Redirecting to dashboard...</p>
                    </div>
                </div>
            )
        )
    }

    // User is not authenticated, show the children (login form)
    return <>{children}</>
}

// Higher-order component for protecting guest-only pages
export function withGuestOnly<P extends object>(
    Component: React.ComponentType<P>,
    redirectTo?: string
) {
    return function GuestOnlyComponent(props: P) {
        return (
            <GuestGuard redirectTo={redirectTo}>
                <Component {...props} />
            </GuestGuard>
        )
    }
}