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