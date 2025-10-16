import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface LoginResponse {
    data: {
        token: string
        userData: Record<string, unknown>
    }
}

export async function POST(request: NextRequest) {
    try {
        const { email, password, role } = await request.json()

        const endpoint = role === 'superAdmin' ? 'super-admin/login' : 'admin/login'

        const response = await axios.post<LoginResponse>(
            `${BASE_URL}/${endpoint}`,
            { email, password },
            { headers: { 'Content-Type': 'application/json' } }
        )

        const { token, userData } = response.data.data

        if (!token) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        return NextResponse.json({
            success: true,
            token,
            userData,
            message: 'Login successful',
        })
    } catch (error: unknown) {
        console.error('Login API error:', error)

        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || 'Login failed'
            const status = error.response?.status || 500
            return NextResponse.json({ error: message }, { status })
        }

        const errorMessage = error instanceof Error ? error.message : 'Login failed'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}
