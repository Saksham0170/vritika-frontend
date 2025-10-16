"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/userStore"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, token, hasHydrated } = useUserStore()

  useEffect(() => {
    if (hasHydrated) {
      if (isAuthenticated && token) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [isAuthenticated, token, hasHydrated, router])

  // Show loading while deciding where to redirect
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
