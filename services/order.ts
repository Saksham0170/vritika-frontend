import { OrdersResponse, OrderResponse, OrderPaginationParams } from '@/types/order'
import { getAuthHeaders } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const getOrdersPaginated = async (params: OrderPaginationParams = {}): Promise<OrdersResponse> => {
    const { page = 1, limit = 10 } = params

    const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    })

    const response = await fetch(`${API_BASE_URL}/admin/orders?${searchParams}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    })

    if (!response.ok) {
        throw new Error('Failed to fetch orders')
    }

    return response.json()
}

export const getOrderById = async (id: string): Promise<OrderResponse> => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    })

    if (!response.ok) {
        throw new Error('Failed to fetch order')
    }

    return response.json()
}