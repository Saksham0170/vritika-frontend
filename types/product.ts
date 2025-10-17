// Product type enum
export type ProductType = "BOS" | "Kit" | "Solar Module" | "Inverter" | "Structure"

export interface Product {
    _id: string
    productName: string
    type: ProductType
    price: number
    // Optional fields
    image?: string
    spvBrand?: string
    spvType?: string
    phase?: string
    capacity?: string
    spvCapacity?: string
    service?: string
    thickness?: string
    createdAt?: string
    updatedAt?: string
    __v?: number
}

export interface CreateProductRequest {
    productName: string
    type: ProductType
    price: number
    // Optional fields
    spvBrand?: string
    spvType?: string
    phase?: string
    capacity?: string
    spvCapacity?: string
    service?: string
    thickness?: string
    image?: string
}

export interface UpdateProductRequest {
    productName?: string
    type?: ProductType
    price?: number
    // Optional fields
    spvBrand?: string
    spvType?: string
    phase?: string
    capacity?: string
    spvCapacity?: string
    service?: string
    thickness?: string
    image?: string
}

export interface ProductsResponse {
    status: boolean
    data: {
        page: number
        limit: number
        totalData: number
        data: Product[]
    }
    message: string
}

export interface ProductResponse {
    status: boolean
    data: Product
    message: string
}

export interface GetProductsParams {
    page?: number
    limit?: number
    search?: string
    type?: string
    spvBrand?: string
    phase?: string
}