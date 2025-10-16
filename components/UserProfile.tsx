// Example usage of the Zustand store
'use client'

import { useUserStore } from '@/store/userStore'
import { Button } from '@/components/ui/button'

export default function UserProfile() {
    const { isAuthenticated, userData, logout } = useUserStore()

    if (!isAuthenticated || !userData) {
        return <div>Not logged in</div>
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">User Profile</h2>
            <div className="space-y-2">
                <p><strong>Name:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>User Type:</strong> {userData.userType}</p>
                <p><strong>ID:</strong> {userData._id}</p>
                {userData.image && (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={userData.image}
                            alt="Profile"
                            className="w-16 h-16 rounded-full"
                        />
                    </>
                )}
            </div>
            <Button
                onClick={logout}
                variant="destructive"
                className="mt-4"
            >
                Logout
            </Button>
        </div>
    )
}