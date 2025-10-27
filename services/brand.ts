import { Brand, CreateBrandRequest, UpdateBrandRequest, PaginatedBrandsResponse, BrandPaginationParams } from "@/types/brand"
import { getAuthHeaders } from "@/lib/auth"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
// Get brands with pagination
export async function getBrandsPaginated(params?: BrandPaginationParams): Promise<PaginatedBrandsResponse> {
    try {
        const searchParams = new URLSearchParams()
        if (params?.page) {
            searchParams.append('page', params.page.toString())
        }
        if (params?.limit) {
            searchParams.append('limit', params.limit.toString())
        }
        if (params?.productCategory) {
            searchParams.append('productCategory', params.productCategory)
        }

        const url = `${API_BASE_URL}/admin/brand${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch brands: ${response.statusText}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching brands:', error)
        throw error
    }
}

// Get all brands (legacy function for backward compatibility)
export async function getBrands(productCategory?: string): Promise<Brand[]> {
    try {
        const searchParams = new URLSearchParams()
        searchParams.append('limit', '1000')
        if (productCategory) {
            searchParams.append('productCategory', productCategory)
        }

        const url = `${API_BASE_URL}/admin/brand?${searchParams.toString()}`

        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch brands: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data?.data
    } catch (error) {
        console.error('Error fetching brands:', error)
        throw error
    }
}

// Get brand by ID
export async function getBrandById(brandId: string): Promise<Brand> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/brand/${brandId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch brand: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error fetching brand:', error)
        throw error
    }
}

// Create a new brand
export async function createBrand(brandData: CreateBrandRequest): Promise<Brand> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/brand`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(brandData),
        })

        if (!response.ok) {
            throw new Error(`Failed to create brand: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error creating brand:', error)
        throw error
    }
}

// Update a brand
export async function updateBrand(brandId: string, brandData: UpdateBrandRequest): Promise<Brand> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/brand/${brandId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(brandData),
        })

        if (!response.ok) {
            throw new Error(`Failed to update brand: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error updating brand:', error)
        throw error
    }
}

// Delete a brand
export async function deleteBrand(brandId: string): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/brand/${brandId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to delete brand: ${response.statusText}`)
        }
    } catch (error) {
        console.error('Error deleting brand:', error)
        throw error
    }
}

// Get a single brand
export async function getBrand(brandId: string): Promise<Brand> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/brand/${brandId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch brand: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error fetching brand:', error)
        throw error
    }
}