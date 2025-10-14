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
      }),
      credentials: 'include' // Important: include cookies in the request
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }

    console.log('Login API response:', data)
    return data
  } catch (error: any) {
    console.error('Login service error:', error)
    throw new Error(error.message || 'Login failed')
  }
}