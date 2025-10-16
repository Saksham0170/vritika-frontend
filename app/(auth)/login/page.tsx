'use client'

import LoginForm from "./components/LoginForm"
import { GuestGuard } from "@/components/guest-guard"

export default function LoginPage() {
  return (
    <GuestGuard>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/40 via-background to-muted/40 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome to Vritika</h1>
          </div>
          <LoginForm />
        </div>
      </div>
    </GuestGuard>
  )
}
