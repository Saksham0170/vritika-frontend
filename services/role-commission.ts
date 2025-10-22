import { RoleCommission, CreateRoleCommissionRequest, UpdateRoleCommissionRequest, PaginatedRoleCommissionsResponse, RoleCommissionPaginationParams } from '@/types/role-commission'
import { getAuthHeaders } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Get role commissions with pagination
export async function getRoleCommissionsPaginated(params?: RoleCommissionPaginationParams): Promise<PaginatedRoleCommissionsResponse> {
    try {
        const searchParams = new URLSearchParams()
        if (params?.page) {
            searchParams.append('page', params.page.toString())
        }
        if (params?.limit) {
            searchParams.append('limit', params.limit.toString())
        }

        const url = `${API_BASE_URL}/admin/role-commission${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch role commissions: ${response.statusText}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching role commissions:', error)
        throw error
    }
}

// Get all role commissions
export async function getRoleCommissions(): Promise<RoleCommission[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/role-commission`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch role commissions: ${response.statusText}`)
        }

        const data = await response.json()
        const roleCommissionArray = data.data?.data
        return roleCommissionArray
    } catch (error) {
        console.error('Error fetching role commissions:', error)
        throw error
    }
}

// Get single role commission by ID
export async function getRoleCommissionById(id: string): Promise<RoleCommission> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/role-commission/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch role commission: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error fetching role commission:', error)
        throw error
    }
}

// Create new role commission
export async function createRoleCommission(roleCommissionData: CreateRoleCommissionRequest): Promise<RoleCommission> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/role-commission`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(roleCommissionData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Failed to create role commission: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error creating role commission:', error)
        throw error
    }
}

// Update role commission
export async function updateRoleCommission(id: string, roleCommissionData: UpdateRoleCommissionRequest): Promise<RoleCommission> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/role-commission/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(roleCommissionData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Failed to update role commission: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error updating role commission:', error)
        throw error
    }
}

// Delete role commission
export async function deleteRoleCommission(id: string): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/role-commission/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Failed to delete role commission: ${response.statusText}`)
        }
    } catch (error) {
        console.error('Error deleting role commission:', error)
        throw error
    }
}