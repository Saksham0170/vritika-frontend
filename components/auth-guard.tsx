"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/userStore"

interface AuthGuardProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
    const router = useRouter()
    const { isAuthenticated, token, hasHydrated } = useUserStore()

    useEffect(() => {
        // Only check authentication after store has hydrated from localStorage
        if (hasHydrated && (!isAuthenticated || !token)) {
            router.push("/login")
        }
    }, [isAuthenticated, token, hasHydrated, router])

    // Show loading while store is hydrating or while checking authentication
    if (!hasHydrated || (!isAuthenticated || !token)) {
        return (
            fallback || (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">
                            {!hasHydrated ? "Loading..." : "Checking authentication..."}
                        </p>
                    </div>
                </div>
            )
        )
    }

    return <>{children}</>
}

// Higher-order component for protecting pages
export function withAuth<P extends object>(
    Component: React.ComponentType<P>
) {
    return function ProtectedComponent(props: P) {
        return (
            <AuthGuard>
                <Component {...props} />
            </AuthGuard>
        )
    }
}