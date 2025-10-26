export interface Salesperson {
    _id: string
    name: string
    phoneNumber: string
    email: string
    address: string
    selfie?: string
    aadharCardNumber: string
    aadharCardFront?: string
    aadharCardBack?: string
    panCardNumber: string
    panCardFront?: string
    bankAccountNumber: string
    bankIfscCode: string
    bankAccountName: string
    cancelChequePhoto?: string
    status: "Active" | "Inactive"
    createdAt?: string
    updatedAt?: string
}

export interface CreateSalespersonRequest {
    name: string
    phoneNumber: string
    email?: string
    address?: string
    selfie?: string
    aadharCardNumber?: string
    aadharCardFront?: string
    aadharCardBack?: string
    panCardNumber?: string
    panCardFront?: string
    bankAccountNumber?: string
    bankIfscCode?: string
    bankAccountName?: string
    cancelChequePhoto?: string
    status: "Active" | "Inactive"
}

export interface UpdateSalespersonRequest {
    name?: string
    phoneNumber?: string
    email?: string
    address?: string
    selfie?: string
    aadharCardNumber?: string
    aadharCardFront?: string
    aadharCardBack?: string
    panCardNumber?: string
    panCardFront?: string
    bankAccountNumber?: string
    bankIfscCode?: string
    bankAccountName?: string
    cancelChequePhoto?: string
    status?: "Active" | "Inactive"
}

export interface PaginatedSalespersonsResponse {
    status: boolean
    data: {
        page: number
        limit: number
        totalData: number
        data: Salesperson[]
    }
    message: string
}

export interface SalespersonPaginationParams {
    page?: number
    limit?: number
}