import {
    Coupon,
    CreateCouponRequest,
    UpdateCouponRequest,
    CouponListResponse,
    SalesPersonListResponse
} from "@/types/coupon"
import { getAuthHeaders } from "@/lib/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Get all coupons with pagination
export async function getCoupons(page = 1, limit = 10): Promise<CouponListResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/coupon?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch coupons: ${response.statusText}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching coupons:', error)
        throw error
    }
}

// Get single coupon by ID
export async function getCouponById(id: string): Promise<Coupon> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/coupon/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch coupon: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error fetching coupon:', error)
        throw error
    }
}

// Create new coupon
export async function createCoupon(couponData: CreateCouponRequest): Promise<Coupon> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/coupon`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(couponData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Failed to create coupon: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error creating coupon:', error)
        throw error
    }
}

// Update coupon
export async function updateCoupon(id: string, couponData: UpdateCouponRequest): Promise<Coupon> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/coupon/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(couponData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Failed to update coupon: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error updating coupon:', error)
        throw error
    }
}

// Delete coupon
export async function deleteCoupon(id: string): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/coupon/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Failed to delete coupon: ${response.statusText}`)
        }
    } catch (error) {
        console.error('Error deleting coupon:', error)
        throw error
    }
}

// Get salespeople for coupon assignment
export async function getSalesPersons(): Promise<SalesPersonListResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/coupon/salespeople`, {
            method: 'GET',
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch salespeople: ${response.statusText}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching salespeople:', error)
        throw error
    }
}

// Assign salespeople to coupon
export async function assignSalesPersonsToCoupon(
    couponId: string,
    salesPersonIds: string[]
): Promise<Coupon> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/coupon/${couponId}/assign`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ salesPersonIds }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Failed to assign salespeople: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error assigning salespeople to coupon:', error)
        throw error
    }
}

// Remove salespeople from coupon
export async function removeSalesPersonsFromCoupon(
    couponId: string,
    salesPersonIds: string[]
): Promise<Coupon> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/coupon/${couponId}/remove`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ salesPersonIds }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Failed to remove salespeople: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
    } catch (error) {
        console.error('Error removing salespeople from coupon:', error)
        throw error
    }
}