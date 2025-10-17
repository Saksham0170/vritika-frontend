export interface SubAdmin {
    _id: string
    name: string
    phone: string
    email: string
    adminType: "Organisation" | "Individual"
    gstNo?: string
    contactPersonName?: string
    address?: string
    aadharCardNo?: string
    aadharCardImage?: string[]
    panCardNo?: string
    panCardImage?: string[]
    bankAccountNo?: string
    ifscCode?: string
    bankHolderName?: string
    passbookImage?: string
    password?: string
    level?: number
    parentAdmin?: string
    rootAdminId?: string
    createdAt?: string
    updatedAt?: string
}

export interface CreateSubAdminRequest {
    name: string
    phone: string
    email: string
    adminType: "Organisation" | "Individual"
    gstNo?: string
    contactPersonName?: string
    address: string
    aadharCardNo: string
    aadharCardImage?: string[]
    panCardNo: string
    panCardImage?: string[]
    bankAccountNo: string
    ifscCode: string
    bankHolderName: string
    passbookImage?: string
    password: string
}

export interface UpdateSubAdminRequest {
    name?: string
    phone?: string
    email?: string
    adminType?: "Organisation" | "Individual"
    gstNo?: string
    contactPersonName?: string
    address?: string
    aadharCardNo?: string
    aadharCardImage?: string[]
    panCardNo?: string
    panCardImage?: string[]
    bankAccountNo?: string
    ifscCode?: string
    bankHolderName?: string
    passbookImage?: string
}

export interface PaginatedSubAdminsResponse {
    status: boolean
    data: {
        page: number
        limit: number
        totalData: number
        data: SubAdmin[]
    }
    message: string
}

export interface SubAdminPaginationParams {
    page?: number
    limit?: number
}