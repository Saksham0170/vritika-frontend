export interface Customer {
    _id: string
    leadId: string
    customerPhoneNo: string
    customerGroup: string
    customerSubGroup: string
    segment: string
    proposalDate: string
    title: string
    customerContactName: string
    emailId: string
    customerAddress: string
    state: string
    district: string
    pinCode: string
    verify: boolean
    salesPersonId: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface SiteSurvey {
    _id: string
    length: number
    width: number
    images: string[]
    obstacleCheck: boolean
    shadowAnalysis: boolean
    roofSurfaceType: string
    totalRoofs: number
    roofAccessibility: string
    sensationLoadKW: number
    solarCapacity: number
    electricityBillImages: string[]
    gensatAvailable: boolean
    salesPersonId: string
    customerId: string
    adminId: string
    subAdminId: string
    coordinates: {
        type: string
        coordinates: number[]
        status: string
    }
    boxCoordinates: any[]
    createdAt: string
    updatedAt: string
    __v: number
    acPremises: string
    carsOwned: string
    conductPipe: boolean
    distance: string
    gridInverters: string
    loanRequired: boolean
    roofSurface: string
    subsidy: boolean
    surfaceSoil: string
}

export interface OrderProduct {
    _id: string
    adminId: string
    image: string
    productName: string
    type: string
    price: number
    category: string
    sellinPrice: string
    createdAt: string
    updatedAt: string
    quantity: number
    spvCapacity?: string
    spvBrand?: string
    spvType?: string
    width?: string
    height?: string
    weight?: string
    brands?: {
        _id: string
        adminId: string
        brandName: string
        brandDetails: string
        productCategory: string[]
        quality: string
        image: string
        createdAt: string
        updatedAt: string
        __v: number
    }
    selected?: boolean
    deception?: string
}

export interface Order {
    _id: string
    salesPersonId: string
    SiteSurveyId: string
    customerId: string
    adminId: string
    subAdminId: string
    sytemType: string
    data: OrderProduct[]
    createdAt: string
    updatedAt: string
    status: string
    customer: Customer
    sitesurveys: SiteSurvey
}

export interface OrdersResponse {
    status: boolean
    data: {
        page: number
        limit: number
        totalData: number
        data: Order[]
    }
    message: string
}

export interface OrderResponse {
    status: boolean
    data: Order
    message: string
}

export interface OrderPaginationParams {
    page?: number
    limit?: number
}