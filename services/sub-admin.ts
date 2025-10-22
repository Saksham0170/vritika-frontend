import { SubAdmin, CreateSubAdminRequest, UpdateSubAdminRequest, PaginatedSubAdminsResponse, SubAdminPaginationParams } from '@/types/sub-admin'
import { getAuthHeaders } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Get sub-admins with pagination
export async function getSubAdminsPaginated(params?: SubAdminPaginationParams): Promise<PaginatedSubAdminsResponse> {
    try {
        const searchParams = new URLSearchParams()
        if (params?.page) {
            searchParams.append('page', params.page.toString())
        }
        if (params?.limit) {
            searchParams.append('limit', params.limit.toString())
        }

        const url = `${API_BASE_URL}/admin/sub-admin${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch sub-admins: ${response.statusText}`)
        }

        const data = await response.json()
        console.log('Response data from getSubAdminsPaginated:', data)
        return data
    } catch (error) {
        console.error('Error fetching sub-admins:', error)
        throw error
    }
}

// Get all sub-admins
export async function getSubAdmins(): Promise<SubAdmin[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/sub-admin`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch sub-admins: ${response.statusText}`)
        }

        const data = await response.json()
        const subAdminArray = data.data?.data
        console.log('Fetched sub-admins:', subAdminArray)
        return subAdminArray
    } catch (error) {
        console.error('Error fetching sub-admins:', error)
        throw error
    }
}

// Get sub-admin by ID
export async function getSubAdminById(id: string): Promise<SubAdmin> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/sub-admin/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch sub-admin: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data || data
    } catch (error) {
        console.error('Error fetching sub-admin:', error)
        throw error
    }
}

// Create new sub-admin
export async function createSubAdmin(subAdminData: CreateSubAdminRequest): Promise<SubAdmin> {
    try {
        console.log('Creating sub-admin with data:', subAdminData)

        const response = await fetch(`${API_BASE_URL}/admin/sub-admin`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(subAdminData),
        })

        console.log('Create sub-admin response status:', response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Create sub-admin error response:', errorText)
            throw new Error(`Failed to create sub-admin: ${response.status} ${response.statusText} - ${errorText}`)
        }

        const data = await response.json()
        console.log('Create sub-admin success response:', data)
        return data.data || data
    } catch (error) {
        console.error('Error creating sub-admin:', error)
        throw error
    }
}

// Update sub-admin
export async function updateSubAdmin(id: string, subAdminData: UpdateSubAdminRequest): Promise<SubAdmin> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/sub-admin/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(subAdminData),
        })

        if (!response.ok) {
            throw new Error(`Failed to update sub-admin: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data || data
    } catch (error) {
        console.error('Error updating sub-admin:', error)
        throw error
    }
}

// Delete sub-admin
export async function deleteSubAdmin(id: string): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/sub-admin/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to delete sub-admin: ${response.statusText}`)
        }
    } catch (error) {
        console.error('Error deleting sub-admin:', error)
        throw error
    }
}