import { LoginPayload } from "@/types/auth"

export async function login(payload: LoginPayload) {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        role: payload.role
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }

    return data
  } catch (error: unknown) {
    console.error('Login service error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Login failed'
    throw new Error(errorMessage)
  }
}