// Product type enum - Updated to match the API
export type ProductType =
    | "Solar Module"
    | "Inverter"
    | "Batteries"
    | "Cables"
    | "Structure"
    | "BOS"
    | "Service"
    | "Kit"
    | "Services/Freebies"

// Enum types for specific fields
export type SpvTypeModule = "Monocrystalline" | "Polycrystalline" | "TOP CON" | "Bifacial"
export type SpvTypeInverter = "Ongrid" | "Offgrid" | "Hybrid"
export type SpvTypeBattery = "Lead Acid" | "Lithium"
export type SpvTypeCable = "AC Cable" | "DC Cable" | "Earthing Cable"
export type SpvTypeService = "Service Charge ( Per KWP)" | "Civil work (Per KWP)" | "Conduit Pipe (Per Description )" | "Net Metering 1 phase" | "Net metering 3 phase" | "Per floor price (above 2)"
export type SpvTypeBOS = "ACDB" | "DCDB" | "Lightning Arrester" | "MC4 Connector" | "Earthing"
export type Phase = "Single Phase" | "Three Phase"
export type CategoryPricing = "Premium" | "Mid-Priced" | "Low-Priced"
export type CategoryKit = "Premium" | "Mid" | "Low"
export type Unit = "meter" | "inch" | "cm"

// Brand details interface for nested brand information
export interface BrandDetails {
    _id: string
    brandName: string
    brandDetails: string
    productCategory: string[]
    quality: string
    image: string
}

// Database Product interface 
export interface Product {
    _id: string
    productName: string
    type: ProductType
    price: number
    sellinPrice: number
    image?: string

    // Brand information - nested object
    brandDetails?: BrandDetails

    // Solar Module specific
    spvBrand?: string
    spvType?: SpvTypeModule | SpvTypeInverter | SpvTypeBattery | SpvTypeCable | SpvTypeService | SpvTypeBOS
    category?: CategoryPricing | CategoryKit
    spvCapacity?: string

    // Inverter specific
    phase?: Phase
    capacity?: string

    // Structure specific
    height?: string
    width?: string
    weight?: string
    elevateStructure?: string

    // Cables specific
    unit?: Unit
    free?: string
    thickness?: string

    // Service specific
    description?: string

    // Kit specific
    mrp?: number
    sellingPrice?: number

    // Timestamps
    createdAt?: string
    updatedAt?: string
    __v?: number
}

// Base interface for form fields
interface BaseProductForm {
    productName: string
    image?: string
    price: number
    sellinPrice: number
    type: ProductType
}

// Type-specific form interfaces based on API specifications

export interface SolarModuleForm extends BaseProductForm {
    type: "Solar Module"
    spvBrand: string
    spvType: SpvTypeModule
    category: CategoryPricing
    spvCapacity: string
}

export interface InverterForm extends BaseProductForm {
    type: "Inverter"
    spvBrand: string
    spvType: SpvTypeInverter
    phase: Phase
    capacity: string
}

export interface StructureForm extends BaseProductForm {
    type: "Structure"
    height: string
    width: string
    weight: string
    category: CategoryPricing
    elevateStructure: string
}

export interface BatteriesForm extends BaseProductForm {
    type: "Batteries"
    spvBrand: string
    spvType: SpvTypeBattery
}

export interface CablesForm extends BaseProductForm {
    type: "Cables"
    spvBrand: string
    spvType: SpvTypeCable
    unit: Unit
    free: string
    thickness: string
}

export interface BOSForm extends BaseProductForm {
    type: "BOS"
    spvType: SpvTypeBOS
    description: string
}

export interface ServiceForm extends BaseProductForm {
    type: "Service"
    spvType: SpvTypeService
    description: string
}

export interface KitForm extends BaseProductForm {
    type: "Kit"
    spvBrand: string
    category: CategoryKit
    spvCapacity: string
    mrp: number
    sellingPrice: number
    description: string
}

export interface ServicesFreebiesForm extends BaseProductForm {
    type: "Services/Freebies"
    category: string
    description?: string
}

// Union type for form usage
export type ProductForm =
    | SolarModuleForm
    | InverterForm
    | BatteriesForm
    | CablesForm
    | StructureForm
    | BOSForm
    | ServiceForm
    | KitForm
    | ServicesFreebiesForm

// API Request/Response types
export interface CreateProductRequest {
    productName: string
    type: ProductType
    price: number
    sellinPrice: number
    image?: string

    // Solar Module fields
    spvBrand?: string
    spvType?: SpvTypeModule | SpvTypeInverter | SpvTypeBattery | SpvTypeCable | SpvTypeService | SpvTypeBOS
    category?: CategoryPricing | CategoryKit | string
    spvCapacity?: string

    // Inverter fields
    phase?: Phase
    capacity?: string

    // Structure fields
    height?: string
    width?: string
    weight?: string
    elevateStructure?: string

    // Cables fields
    unit?: Unit
    free?: string
    thickness?: string

    // Service fields
    description?: string

    // Kit fields
    mrp?: number
    sellingPrice?: number
}

export interface UpdateProductRequest {
    productName?: string
    type?: ProductType
    price?: number
    sellinPrice?: number
    image?: string

    // Solar Module fields
    spvBrand?: string
    spvType?: SpvTypeModule | SpvTypeInverter | SpvTypeBattery | SpvTypeCable | SpvTypeService | SpvTypeBOS
    category?: CategoryPricing | CategoryKit | string
    spvCapacity?: string

    // Inverter fields
    phase?: Phase
    capacity?: string

    // Structure fields
    height?: string
    width?: string
    weight?: string
    elevateStructure?: string

    // Cables fields
    unit?: Unit
    free?: string
    thickness?: string

    // Service fields
    description?: string

    // Kit fields
    mrp?: number
    sellingPrice?: number
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
