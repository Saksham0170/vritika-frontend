import { Salesperson, CreateSalespersonRequest, UpdateSalespersonRequest, PaginatedSalespersonsResponse, SalespersonPaginationParams } from '@/types/salesperson'
import { getAuthHeaders } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Get salespersons with pagination
export async function getSalespersonsPaginated(params?: SalespersonPaginationParams): Promise<PaginatedSalespersonsResponse> {
    try {
        const searchParams = new URLSearchParams()
        if (params?.page) {
            searchParams.append('page', params.page.toString())
        }
        if (params?.limit) {
            searchParams.append('limit', params.limit.toString())
        }

        const url = `${API_BASE_URL}/admin/sales-persons${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch salespersons: ${response.statusText}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching salespersons:', error)
        throw error
    }
}

// Get all salespersons
export async function getSalespersons(): Promise<Salesperson[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/sales-persons?limit=1000`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch salespersons: ${response.statusText}`)
        }

        const data = await response.json()
        // Handle different response structures
        const salespersonArray = data.data?.data || data.data || []

        // Ensure we always return an array
        if (!Array.isArray(salespersonArray)) {
            console.warn('Expected salesperson data to be an array, got:', typeof salespersonArray)
            return []
        }

        return salespersonArray
    } catch (error) {
        console.error('Error fetching salespersons:', error)
        throw error
    }
}

// Get salesperson by ID
export async function getSalespersonById(id: string): Promise<Salesperson> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/sales-persons/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch salesperson: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data || data
    } catch (error) {
        console.error('Error fetching salesperson:', error)
        throw error
    }
}

// Create new salesperson
export async function createSalesperson(salespersonData: CreateSalespersonRequest): Promise<Salesperson> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/sales-persons`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(salespersonData),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Failed to create salesperson: ${response.status} ${response.statusText} - ${errorText}`)
        }

        const data = await response.json()
        return data.data || data
    } catch (error) {
        console.error('Error creating salesperson:', error)
        throw error
    }
}

// Update salesperson
export async function updateSalesperson(id: string, salespersonData: UpdateSalespersonRequest): Promise<Salesperson> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/sales-persons/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(salespersonData),
        })

        if (!response.ok) {
            throw new Error(`Failed to update salesperson: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data || data
    } catch (error) {
        console.error('Error updating salesperson:', error)
        throw error
    }
}

// Delete salesperson
export async function deleteSalesperson(id: string): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/sales-persons/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to delete salesperson: ${response.statusText}`)
        }
    } catch (error) {
        console.error('Error deleting salesperson:', error)
        throw error
    }
}