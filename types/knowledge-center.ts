export interface KnowledgeCenterEntry {
    _id: string
    adminId: string
    type: "video" | "pdf"
    url: string
    rootAdminId: string
    status: boolean
    createdAt: string
    updatedAt: string
}

export interface CreateKnowledgeCenterRequest {
    type: "video" | "pdf"
    url: string
    status: boolean
}

export interface UpdateKnowledgeCenterRequest {
    type?: "video" | "pdf"
    url?: string
    status?: boolean
}

export interface KnowledgeCenterPaginationParams {
    page?: number
    limit?: number
}

export interface PaginatedKnowledgeCenterResponse {
    status: boolean
    data: {
        page: number
        limit: number
        totalData: number
        data: KnowledgeCenterEntry[]
    }
    message: string
}

export interface KnowledgeCenterResponse {
    status: boolean
    data: KnowledgeCenterEntry
    message: string
}
