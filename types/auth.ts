export interface LoginPayload {
    email: string
    password: string
    role: 'admin' | 'superAdmin'
}

export interface LoginResponse {
    data: {
        token: string
        userData: {
            _id: string
            email: string
            userType: "Admin" | "SuperAdmin"
            name: string
            image?: string
        }
    }
}