import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserData {
    _id: string
    email: string
    userType: "Admin" | "SuperAdmin" | "SubAdmin"
    name: string
    image?: string
}

interface UserState {
    isAuthenticated: boolean
    userData: UserData | null
    token: string | null
    hasHydrated: boolean
    setUser: (userData: UserData, token: string) => void
    logout: () => void
    clearUser: () => void
    getToken: () => string | null
    setHasHydrated: (state: boolean) => void
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            userData: null,
            token: null,
            hasHydrated: false,
            setUser: (userData, token) => set({
                isAuthenticated: true,
                userData,
                token
            }),
            logout: async () => {
                try {
                    await fetch('/api/logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                } catch (error) {
                    console.error('Logout API error:', error)
                }
                set({ isAuthenticated: false, userData: null, token: null })
            },
            clearUser: () => set({ isAuthenticated: false, userData: null, token: null }),
            getToken: () => get().token,
            setHasHydrated: (state) => set({ hasHydrated: state }),
        }),
        {
            name: 'user-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true)
            },
        }
    )
)
