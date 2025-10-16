export interface Admin {
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
    createdAt?: string
    updatedAt?: string
}

export interface CreateAdminRequest {
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
    password: string
}

export interface UpdateAdminRequest {
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