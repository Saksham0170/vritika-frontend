import {
    KnowledgeCenterEntry,
    CreateKnowledgeCenterRequest,
    UpdateKnowledgeCenterRequest,
    PaginatedKnowledgeCenterResponse,
    KnowledgeCenterResponse,
    KnowledgeCenterPaginationParams
} from '@/types/knowledge-center'
import { getAuthHeaders } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Get knowledge center entries with pagination
export async function getKnowledgeCenterPaginated(params?: KnowledgeCenterPaginationParams): Promise<PaginatedKnowledgeCenterResponse> {
    try {
        const searchParams = new URLSearchParams()
        if (params?.page) {
            searchParams.append('page', params.page.toString())
        }
        if (params?.limit) {
            searchParams.append('limit', params.limit.toString())
        }

        const url = `${API_BASE_URL}/admin/knowledge-center${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch knowledge center entries: ${response.statusText}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching knowledge center entries:', error)
        throw error
    }
}

// Get single knowledge center entry by ID
export async function getKnowledgeCenterById(id: string): Promise<KnowledgeCenterResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/knowledge-center/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch knowledge center entry: ${response.statusText}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching knowledge center entry:', error)
        throw error
    }
}

// Create new knowledge center entry
export async function createKnowledgeCenter(data: CreateKnowledgeCenterRequest): Promise<KnowledgeCenterResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/knowledge-center`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Failed to create knowledge center entry: ${response.statusText}`)
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error('Error creating knowledge center entry:', error)
        throw error
    }
}

// Update knowledge center entry
export async function updateKnowledgeCenter(id: string, data: UpdateKnowledgeCenterRequest): Promise<KnowledgeCenterResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/knowledge-center/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Failed to update knowledge center entry: ${response.statusText}`)
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error('Error updating knowledge center entry:', error)
        throw error
    }
}

// Delete knowledge center entry
export async function deleteKnowledgeCenter(id: string): Promise<{ status: boolean; message: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/knowledge-center/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Failed to delete knowledge center entry: ${response.statusText}`)
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error('Error deleting knowledge center entry:', error)
        throw error
    }
}
