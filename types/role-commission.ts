export interface RoleCommission {
    _id: string
    level: number
    commissionPercentage: number
    description: string
    status: boolean
    createdAt: string
    updatedAt: string
    __v?: number
}

export interface CreateRoleCommissionRequest {
    level: number
    commissionPercentage: number
    description: string
    status: boolean
}

export interface UpdateRoleCommissionRequest {
    level?: number
    commissionPercentage?: number
    description?: string
    status?: boolean
}

export interface RoleCommissionPaginationParams {
    page?: number
    limit?: number
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