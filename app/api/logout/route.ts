import { NextResponse } from 'next/server'

export async function POST() {
    try {
        // No server-side logout logic since token is handled client-side
        return NextResponse.json({
            success: true,
            message: 'Logged out successfully',
        })
    } catch (error: unknown) {
        console.error('Logout API error:', error)

        const errorMessage = error instanceof Error ? error.message : 'Logout failed'
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}
