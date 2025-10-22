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