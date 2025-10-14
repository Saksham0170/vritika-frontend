import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function POST(request: NextRequest) {
    try {
        const { email, password, role } = await request.json()

        // Determine the endpoint based on role
        const endpoint = role === 'superAdmin' ? 'super-admin/login' : 'admin/login'

        // Make the actual login request to your backend
        const response = await axios.post(
            `${BASE_URL}/${endpoint}`,
            {
                email,
                password
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )

        const { token, userData } = response.data.data

        if (!token) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Create the response
        const nextResponse = NextResponse.json({
            success: true,
            userData,
            message: 'Login successful'
        })

        // Set HTTP-only cookie with the token
        nextResponse.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
        })

        // Also set user data in a separate cookie (not HTTP-only so client can access)
        nextResponse.cookies.set('userData', JSON.stringify(userData), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
        })

        return nextResponse

    } catch (error: any) {
        console.error('Login API error:', error)

        if (error.response) {
            return NextResponse.json(
                { error: error.response.data.message || 'Login failed' },
                { status: error.response.status }
            )
        } else if (error.request) {
            return NextResponse.json(
                { error: 'No response from server' },
                { status: 500 }
            )
        } else {
            return NextResponse.json(
                { error: error.message || 'Login failed' },
                { status: 500 }
            )
        }
    }
}