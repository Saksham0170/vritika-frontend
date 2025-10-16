export interface LoginPayload {
    email: string
    password: string
    role: 'admin' | 'superAdmin'
}

export interface LoginResponse {
    success: boolean
    token: string
    userData: {
        _id: string
        email: string
        userType: "Admin" | "Super Admin"
        name: string
        image?: string
    }
    message: string
}