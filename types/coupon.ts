export interface SalesPerson {
    _id: string
    name: string
    phoneNumber: string
    email: string
    status?: string
    level?: number
}

export interface Coupon {
    _id: string
    couponCode: string
    description: string
    discountType: "percentage" //fixed, just sending it to backend
    discountValue: number
    maxDiscountAmount: number
    minOrderAmount: number
    adminId?: string
    assignedSalesPersons: SalesPerson[]
    validFrom: string
    validUntil: string
    maxUsageCount: number
    currentUsageCount: number
    maxUsagePerSalesPerson: number
    isActive: boolean
    status: string
    usageHistory: any[]
    createdAt: string
    updatedAt: string
    __v: number
}

export interface CreateCouponRequest {
    couponCode: string
    description: string
    discountType: "percentage" | "flat"
    discountValue: number
    maxDiscountAmount: number
    minOrderAmount: number
    assignedSalesPersons: string[]
    validFrom: string
    validUntil: string
    maxUsageCount: number
    maxUsagePerSalesPerson: number
    isActive: boolean
}

export interface UpdateCouponRequest {
    couponCode?: string
    description?: string
    discountValue?: number
    maxDiscountAmount?: number
    minOrderAmount?: number
    assignedSalesPersons?: string[]
    validFrom?: string
    validUntil?: string
    maxUsageCount?: number
    maxUsagePerSalesPerson?: number
    isActive?: boolean
    status?: string
}export interface CouponListResponse {
    status: boolean
    data: {
        page: number
        limit: number
        totalData: number
        data: Coupon[]
    }
    message: string
}

export interface SalesPersonListResponse {
    status: boolean
    data: SalesPerson[]
    message: string
}

export interface AssignRemoveSalesPersonRequest {
    salesPersonIds: string[]
}
