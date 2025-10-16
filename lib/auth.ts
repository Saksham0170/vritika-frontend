import { useUserStore } from "@/store/userStore"

// Function to get auth headers for API requests
export const getAuthHeaders = (): HeadersInit => {
    const token = useUserStore.getState().token

    if (token) {
        return {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }

    return {
        'Content-Type': 'application/json',
    }
}

// Function to get token directly
export const getToken = (): string | null => {
    return useUserStore.getState().token
}