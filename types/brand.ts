export interface Brand {
    _id: string
    brandName: string
    brandDetails: string
    productCategory: string[]
    quality: string
    createdAt: string
    updatedAt: string
}

export interface CreateBrandRequest {
    brandName: string
    brandDetails: string
    productCategory: string[]
    quality: string
}

export interface UpdateBrandRequest {
    brandName?: string
    brandDetails?: string
    productCategory?: string[]
    quality?: string
}

export interface PaginatedBrandsResponse {
    status: boolean
    data: {
        page: number
        limit: number
        totalData: number
        data: Brand[]
    }
    message: string
}

export interface BrandPaginationParams {
    page?: number
    limit?: number
    productCategory?: string
}