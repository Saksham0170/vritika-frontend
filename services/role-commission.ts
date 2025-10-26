import { RoleCommission, CreateRoleCommissionRequest, UpdateRoleCommissionRequest, PaginatedRoleCommissionsResponse, RoleCommissionPaginationParams } from '@/types/role-commission'
import { getAuthHeaders } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Get commissions with pagination (sub-admin or sales-person)
export async function getRoleCommissionsPaginated(params?: RoleCommissionPaginationParams): Promise<PaginatedRoleCommissionsResponse> {
    try {
        const searchParams = new URLSearchParams()
        if (params?.page) {
            searchParams.append('page', params.page.toString())
        }
        if (params?.limit) {
            searchParams.append('limit', params.limit.toString())
        }
        if (params?.type) {
            searchParams.append('type', params.type)
        }

        const url = `${API_BASE_URL}/admin/commission${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch commissions: ${response.statusText}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching commissions:', error)
        throw error
    }
}

// Get all commissions (sub-admin or sales-person)
export async function getRoleCommissions(type?: 'sub-admin' | 'sales-person'): Promise<RoleCommission[]> {
    try {
        const searchParams = new URLSearchParams()
        if (type) {
            searchParams.append('type', type)
        }

        const url = `${API_BASE_URL}/admin/commission${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch commissions: ${response.statusText}`)
        }

        const data = await response.json()
        const roleCommissionArray = data.data?.data
        return roleCommissionArray
    } catch (error) {
        console.error('Error fetching commissions:', error)
        throw error
    }
}

// Get single sub-admin commission by Sub-Admin ID
export async function getRoleCommissionBySubAdminId(subAdminId: string): Promise<RoleCommission> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/commission/${subAdminId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch sub-admin commission: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error fetching sub-admin commission:', error)
        throw error
    }
}

// Get single salesperson commission by Salesperson ID
export async function getRoleCommissionBySalesPersonId(salesPersonId: string): Promise<RoleCommission> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/commission/${salesPersonId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch salesperson commission: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error fetching salesperson commission:', error)
        throw error
    }
}

// Get single sub-admin commission by Sub-Admin ID
export async function getRoleCommissionById(subAdminId: string): Promise<RoleCommission> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/commission/${subAdminId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch sub-admin commission: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error fetching sub-admin commission:', error)
        throw error
    }
}

// Create new sub-admin commission
export async function createRoleCommission(roleCommissionData: CreateRoleCommissionRequest): Promise<RoleCommission> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/commission`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(roleCommissionData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Failed to create sub-admin commission: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error creating sub-admin commission:', error)
        throw error
    }
}

// Update sub-admin commission by ID
export async function updateRoleCommissionById(id: string, roleCommissionData: UpdateRoleCommissionRequest): Promise<RoleCommission> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/commission/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(roleCommissionData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Failed to update sub-admin commission: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error updating sub-admin commission:', error)
        throw error
    }
}

// Delete sub-admin commission by ID
export async function deleteRoleCommissionById(id: string): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/commission/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Failed to delete sub-admin commission: ${response.statusText}`)
        }
    } catch (error) {
        console.error('Error deleting sub-admin commission:', error)
        throw error
    }
}