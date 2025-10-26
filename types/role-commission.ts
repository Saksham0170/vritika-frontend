export interface SalesPersonInfo {
    _id: string
    name: string
    email: string
    phoneNumber: string
    address: string
    status: "Active" | "Inactive"
}

export interface SubAdminInfo {
    _id: string
    name: string
    email: string
    code: string
    level: number
}

export interface AdminInfo {
    _id: string
    name: string
    email: string
    level?: number
}

export interface RoleCommission {
    _id: string
    adminId?: AdminInfo
    subAdminId?: SubAdminInfo
    salesPersonId?: SalesPersonInfo
    rootAdminId?: AdminInfo
    level: number
    commissionPercentage: number
    description: string
    status: boolean
    createdAt: string
    updatedAt: string
    __v?: number
}

export interface CreateRoleCommissionRequest {
    subAdminId?: string
    salesPersonId?: string
    commissionPercentage: number
    description: string
}

export interface UpdateRoleCommissionRequest {
    commissionPercentage?: number
    description?: string
}

export interface RoleCommissionPaginationParams {
    page?: number
    limit?: number
    type?: 'sub-admin' | 'sales-person'
}

export interface PaginatedRoleCommissionsResponse {
    status: boolean
    data: {
        data: RoleCommission[]
        pagination: {
            page: number
            limit: number
            total: number
            totalPages: number
        }
    }
    message: string
}