import { Admin, CreateAdminRequest, UpdateAdminRequest, PaginatedAdminsResponse, AdminPaginationParams } from '@/types/admin'
import { getAuthHeaders } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Get admins with pagination
export async function getAdminsPaginated(params?: AdminPaginationParams): Promise<PaginatedAdminsResponse> {
    try {
        const searchParams = new URLSearchParams()
        if (params?.page) {
            searchParams.append('page', params.page.toString())
        }
        if (params?.limit) {
            searchParams.append('limit', params.limit.toString())
        }

        const url = `${API_BASE_URL}/super-admin/admins${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch admins: ${response.statusText}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching admins:', error)
        throw error
    }
}

// Get all admins
export async function getAdmins(): Promise<Admin[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/super-admin/admins`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch admins: ${response.statusText}`)
        }

        const data = await response.json()
        const adminArray = data.data?.data
        return adminArray
    } catch (error) {
        console.error('Error fetching admins:', error)
        throw error
    }
}

// Get admin by ID
export async function getAdminById(id: string): Promise<Admin> {
    try {
        const response = await fetch(`${API_BASE_URL}/super-admin/admins/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch admin: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data || data
    } catch (error) {
        console.error('Error fetching admin:', error)
        throw error
    }
}

// Create new admin
export async function createAdmin(adminData: CreateAdminRequest): Promise<Admin> {
    try {
        const response = await fetch(`${API_BASE_URL}/super-admin/admins`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(adminData),
        })

        if (!response.ok) {
            throw new Error(`Failed to create admin: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data || data
    } catch (error) {
        console.error('Error creating admin:', error)
        throw error
    }
}

// Update admin
export async function updateAdmin(id: string, adminData: UpdateAdminRequest): Promise<Admin> {
    try {
        const response = await fetch(`${API_BASE_URL}/super-admin/admins/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(adminData),
        })

        if (!response.ok) {
            throw new Error(`Failed to update admin: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data || data
    } catch (error) {
        console.error('Error updating admin:', error)
        throw error
    }
}

// Delete admin
export async function deleteAdmin(id: string): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/super-admin/admins/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to delete admin: ${response.statusText}`)
        }
    } catch (error) {
        console.error('Error deleting admin:', error)
        throw error
    }
}