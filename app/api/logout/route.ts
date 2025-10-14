import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json({
            success: true,
            message: 'Logged out successfully'
        })

        // Clear the cookies
        response.cookies.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
            path: '/'
        })

        response.cookies.set('userData', '', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
            path: '/'
        })

        return response

    } catch (error: any) {
        console.error('Logout API error:', error)
        return NextResponse.json(
            { error: 'Logout failed' },
            { status: 500 }
        )
    }
}