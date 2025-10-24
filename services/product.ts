import { CreateProductRequest, UpdateProductRequest, Product, ProductsResponse, ProductResponse, GetProductsParams } from '@/types/product'
import { getAuthHeaders } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const createProduct = async (productData: CreateProductRequest): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/admin/product`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
    })

    if (!response.ok) {
        throw new Error('Failed to create product')
    }

    const result: ProductResponse = await response.json()
    return result.data
}

export const getProductsPaginated = async (params: GetProductsParams = {}): Promise<ProductsResponse> => {
    const { page = 1, limit = 10, search, type, spvBrand, phase } = params

    const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    })

    if (search) searchParams.append('search', search)
    if (type) searchParams.append('type', type)
    if (spvBrand) searchParams.append('spvBrand', spvBrand)
    if (phase) searchParams.append('phase', phase)

    const response = await fetch(`${API_BASE_URL}/admin/product?${searchParams.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    })

    if (!response.ok) {
        throw new Error('Failed to fetch products')
    }

    return await response.json()
}

export const getProducts = async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/product?limit=1000`, {
        method: 'GET',
        headers: getAuthHeaders(),
    })

    if (!response.ok) {
        throw new Error('Failed to fetch products')
    }

    const result: ProductsResponse = await response.json()
    return result.data.data
}

export const getProductById = async (id: string): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/admin/product/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    })

    if (!response.ok) {
        throw new Error('Failed to fetch product')
    }

    const result: ProductResponse = await response.json()
    return result.data
}

export const updateProduct = async (id: string, productData: UpdateProductRequest): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/admin/product/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
    })

    if (!response.ok) {
        throw new Error('Failed to update product')
    }

    const result: ProductResponse = await response.json()
    return result.data
}

export const deleteProduct = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/product/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    })

    if (!response.ok) {
        throw new Error('Failed to delete product')
    }
}