"use client"

import { useState, useEffect } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-components"
import { FileUpload } from "@/components/FileUpload"
import { getProductById, updateProduct } from "@/services/product"
import { getBrands } from "@/services/brand"
import { Brand } from "@/types/brand"
import {
    Product,
    UpdateProductRequest,
    ProductType,
    SpvTypeModule,
    SpvTypeInverter,
    SpvTypeBattery,
    SpvTypeCable,
    Phase,
    Unit
} from "@/types/product"
import { UPLOAD_ENDPOINTS } from "@/services/upload"
import { useToast } from "@/hooks/use-toast"

interface ProductEditDialogProps {
    productId: string | null
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

const productTypes: ProductType[] = ["Solar Module", "Inverter", "Batteries", "Cables", "Structure", "BOS", "Service", "Kit", "Services/Freebies"]

const phaseOptions = [
    "Single Phase",
    "Three Phase"
]

// Solar Module SPV Type options
const solarModuleSpvTypes = [
    "Monocrystalline",
    "Polycrystalline",
    "TOP CON",
    "Bifacial"
]

// Inverter SPV Type options
const inverterSpvTypes = [
    "Ongrid",
    "Offgrid",
    "Hybrid"
]

// Battery SPV Type options
const batterySpvTypes = [
    "Lead Acid",
    "Lithium"
]

// Cable SPV Type options
const cableSpvTypes = [
    "AC Cable",
    "DC Cable",
    "Earthing Cable"
]

// Category options for pricing
const categoryPricingOptions = [
    "Premium",
    "Mid-Priced",
    "Low-Priced"
]

// Category options for Kit
const categoryKitOptions = [
    "Premium",
    "Mid",
    "Low"
]

// Unit options
const unitOptions = [
    "meter",
    "inch",
    "cm"
]

export function ProductEditDialog({ productId, open, onClose, onSuccess }: ProductEditDialogProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [product, setProduct] = useState<Product | null>(null)
    const [brands, setBrands] = useState<Brand[]>([])
    const [loadingBrands, setLoadingBrands] = useState(false)

    const [formData, setFormData] = useState({
        productName: "",
        type: "" as ProductType | "",
        price: "",
        sellinPrice: "",
        // Optional fields based on product type
        image: "",
        spvBrand: "",
        spvType: "",
        category: "",
        spvCapacity: "",
        phase: "",
        capacity: "",
        height: "",
        width: "",
        weight: "",
        elevateStructure: "",
        unit: "",
        free: "",
        thickness: "",
        description: "",
    })

    const [fieldErrors, setFieldErrors] = useState({
        productName: "",
        price: "",
        sellinPrice: ""
    })

    useEffect(() => {
        if (open && productId) {
            loadProduct()
        }
    }, [open, productId])

    // Load brands when product type changes
    useEffect(() => {
        if (formData.type && shouldShowBrandField(formData.type)) {
            loadBrands(formData.type)
        }
    }, [formData.type])

    const shouldShowBrandField = (type: string) => {
        return ["Solar Module", "Inverter", "Batteries"].includes(type)
    }

    const loadBrands = async (productCategory: string) => {
        try {
            setLoadingBrands(true)
            const brandsData = await getBrands(productCategory)
            setBrands(brandsData || [])
        } catch (error) {
            console.error('Error loading brands:', error)
            toast({
                title: "Error",
                description: "Failed to load brands",
                variant: "destructive"
            })
        } finally {
            setLoadingBrands(false)
        }
    }

    const loadProduct = async () => {
        if (!productId) return

        try {
            setLoading(true)
            const productData = await getProductById(productId)
            setProduct(productData)

            setFormData({
                productName: productData.productName || "",
                type: productData.type || "",
                price: productData.price?.toString() || "",
                sellinPrice: productData.sellinPrice?.toString() || "",
                image: productData.image || "",
                spvBrand: productData.spvBrand || "",
                spvType: productData.spvType?.toString() || "",
                category: productData.category || "",
                spvCapacity: productData.spvCapacity || "",
                phase: productData.phase || "",
                capacity: productData.capacity || "",
                height: productData.height || "",
                width: productData.width || "",
                weight: productData.weight || "",
                elevateStructure: productData.elevateStructure || "",
                unit: productData.unit || "",
                free: productData.free || "",
                thickness: productData.thickness || "",
                description: productData.description || "",
            })
        } catch (error) {
            console.error("Error loading product:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const validateForm = () => {
        const errors = {
            productName: "",
            price: "",
            sellinPrice: ""
        }

        if (!formData.productName.trim()) {
            errors.productName = "Product name is required"
        }

        if (!formData.price.trim()) {
            errors.price = "MRP is required"
        } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            errors.price = "MRP must be a valid positive number"
        }

        if (!formData.sellinPrice.trim()) {
            errors.sellinPrice = "Selling Price is required"
        } else if (isNaN(Number(formData.sellinPrice)) || Number(formData.sellinPrice) <= 0) {
            errors.sellinPrice = "Selling Price must be a valid positive number"
        }

        setFieldErrors(errors)

        const hasErrors = Object.values(errors).some(error => error !== "")
        if (hasErrors) {
            setTimeout(() => {
                if (errors.productName) {
                    document.getElementById("productName")?.focus()
                } else if (errors.price) {
                    document.getElementById("price")?.focus()
                } else if (errors.sellinPrice) {
                    document.getElementById("sellinPrice")?.focus()
                }
            }, 100)
        }

        return !hasErrors
    }

    const handleSave = async () => {
        if (!productId) return

        try {
            setSaving(true)

            if (!validateForm()) {
                setSaving(false)
                return
            }

            const updateData: UpdateProductRequest = {
                productName: formData.productName.trim(),
                type: formData.type as ProductType,
                price: Number(formData.price),
                sellinPrice: Number(formData.sellinPrice),
                // Optional fields
                image: formData.image.trim() || undefined,
                spvBrand: formData.spvBrand.trim() || undefined,
                spvType: (formData.spvType.trim() as SpvTypeModule | SpvTypeInverter | SpvTypeBattery | SpvTypeCable) || undefined,
                phase: (formData.phase as Phase) || undefined,
                capacity: formData.capacity.trim() || undefined,
                spvCapacity: formData.spvCapacity.trim() || undefined,
                thickness: formData.thickness.trim() || undefined,
            }

            await updateProduct(productId, updateData)
            toast({
                title: "Success",
                description: "Product updated successfully",
                variant: "success"
            })
            onSuccess?.()
            onClose()
        } catch (error: unknown) {
            console.error("Error updating product:", error)
            toast({
                title: "Error updating product",
                description: error instanceof Error ? error.message : 'Unknown error',
                variant: "destructive"
            })
        } finally {
            setSaving(false)
        }
    }

    const handleClose = () => {
        if (loading || saving) return

        setProduct(null)
        setBrands([])
        setFormData({
            productName: "",
            type: "",
            price: "",
            sellinPrice: "",
            image: "",
            spvBrand: "",
            spvType: "",
            category: "",
            spvCapacity: "",
            phase: "",
            capacity: "",
            height: "",
            width: "",
            weight: "",
            elevateStructure: "",
            unit: "",
            free: "",
            thickness: "",
            description: "",
        })
        setFieldErrors({
            productName: "",
            price: "",
            sellinPrice: ""
        })
        onClose()
    }

    const renderTypeSpecificFields = () => {
        switch (formData.type) {
            case "Solar Module":
                return (
                    <>
                        <div>
                            <Label className="mb-2">
                                SPV Brand <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.spvBrand}
                                onValueChange={(value) => handleInputChange("spvBrand", value)}
                                disabled={loadingBrands}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={loadingBrands ? "Loading brands..." : "Select SPV brand"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((brand) => (
                                        <SelectItem key={brand._id} value={brand._id}>
                                            {brand.brandName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="mb-2">
                                SPV Type <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.spvType}
                                onValueChange={(value) => handleInputChange("spvType", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select SPV type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {solarModuleSpvTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="mb-2">
                                Category <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleInputChange("category", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryPricingOptions.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="spvCapacity" className="mb-2">
                                SPV Capacity <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="spvCapacity"
                                value={formData.spvCapacity}
                                onChange={(e) => handleInputChange("spvCapacity", e.target.value)}
                                placeholder="Enter SPV capacity"
                            />
                        </div>
                    </>
                )

            case "Inverter":
                return (
                    <>
                        <div>
                            <Label className="mb-2">
                                SPV Brand <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.spvBrand}
                                onValueChange={(value) => handleInputChange("spvBrand", value)}
                                disabled={loadingBrands}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={loadingBrands ? "Loading brands..." : "Select SPV brand"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((brand) => (
                                        <SelectItem key={brand._id} value={brand._id}>
                                            {brand.brandName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="mb-2">
                                SPV Type <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.spvType}
                                onValueChange={(value) => handleInputChange("spvType", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select SPV type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {inverterSpvTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="mb-2">
                                Phase <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.phase}
                                onValueChange={(value) => handleInputChange("phase", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select phase" />
                                </SelectTrigger>
                                <SelectContent>
                                    {phaseOptions.map((phase) => (
                                        <SelectItem key={phase} value={phase}>
                                            {phase}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="capacity" className="mb-2">
                                Capacity <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="capacity"
                                value={formData.capacity}
                                onChange={(e) => handleInputChange("capacity", e.target.value)}
                                placeholder="Enter capacity"
                            />
                        </div>
                    </>
                )

            case "Batteries":
                return (
                    <>
                        <div>
                            <Label className="mb-2">
                                SPV Brand <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.spvBrand}
                                onValueChange={(value) => handleInputChange("spvBrand", value)}
                                disabled={loadingBrands}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={loadingBrands ? "Loading brands..." : "Select SPV brand"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((brand) => (
                                        <SelectItem key={brand._id} value={brand._id}>
                                            {brand.brandName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="mb-2">
                                SPV Type <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.spvType}
                                onValueChange={(value) => handleInputChange("spvType", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select SPV type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {batterySpvTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="capacity" className="mb-2">
                                Capacity <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="capacity"
                                value={formData.capacity}
                                onChange={(e) => handleInputChange("capacity", e.target.value)}
                                placeholder="Enter capacity"
                            />
                        </div>
                        <div>
                            <Label className="mb-2">
                                Category <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleInputChange("category", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryPricingOptions.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                )

            case "Cables":
                return (
                    <>
                        <div>
                            <Label className="mb-2">
                                SPV Type <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.spvType}
                                onValueChange={(value) => handleInputChange("spvType", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select SPV type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cableSpvTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="mb-2">
                                Unit <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.unit}
                                onValueChange={(value) => handleInputChange("unit", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {unitOptions.map((unit) => (
                                        <SelectItem key={unit} value={unit}>
                                            {unit}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="free" className="mb-2">
                                Free
                            </Label>
                            <Input
                                id="free"
                                value={formData.free}
                                onChange={(e) => handleInputChange("free", e.target.value)}
                                placeholder="Enter free details"
                            />
                        </div>
                        <div>
                            <Label htmlFor="thickness" className="mb-2">
                                Thickness
                            </Label>
                            <Input
                                id="thickness"
                                value={formData.thickness}
                                onChange={(e) => handleInputChange("thickness", e.target.value)}
                                placeholder="Enter thickness"
                            />
                        </div>
                    </>
                )

            case "Structure":
                return (
                    <>
                        <div>
                            <Label htmlFor="height" className="mb-2">
                                Height <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="height"
                                value={formData.height}
                                onChange={(e) => handleInputChange("height", e.target.value)}
                                placeholder="Enter height"
                            />
                        </div>
                        <div>
                            <Label htmlFor="width" className="mb-2">
                                Width <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="width"
                                value={formData.width}
                                onChange={(e) => handleInputChange("width", e.target.value)}
                                placeholder="Enter width"
                            />
                        </div>
                        <div>
                            <Label htmlFor="weight" className="mb-2">
                                Weight <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="weight"
                                value={formData.weight}
                                onChange={(e) => handleInputChange("weight", e.target.value)}
                                placeholder="Enter weight"
                            />
                        </div>
                        <div>
                            <Label className="mb-2">
                                Category <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleInputChange("category", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryPricingOptions.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="elevateStructure" className="mb-2">
                                Elevate Structure
                            </Label>
                            <Input
                                id="elevateStructure"
                                value={formData.elevateStructure}
                                onChange={(e) => handleInputChange("elevateStructure", e.target.value)}
                                placeholder="Enter elevate structure details"
                            />
                        </div>
                    </>
                )

            case "BOS":
                return (
                    <div className="col-span-2">
                        <Label htmlFor="description" className="mb-2">
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Enter BOS description"
                        />
                    </div>
                )

            case "Service":
                return (
                    <div className="col-span-2">
                        <Label htmlFor="description" className="mb-2">
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Enter service description"
                        />
                    </div>
                )

            case "Kit":
                return (
                    <>
                        <div>
                            <Label className="mb-2">
                                Category <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleInputChange("category", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryKitOptions.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="description" className="mb-2">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                placeholder="Enter kit description"
                            />
                        </div>
                    </>
                )

            case "Services/Freebies":
                return (
                    <div className="col-span-2">
                        <Label htmlFor="description" className="mb-2">
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Enter services/freebies description"
                        />
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent side="right" className="w-[80vw] sm:w-[70vw] lg:w-[50vw] xl:w-[40vw] max-w-2xl overflow-y-auto rounded-2xl border border-border/40 bg-background text-foreground shadow-lg">
                <SheetHeader className="bg-background/70 backdrop-blur-md border-b border-border/40">
                    <SheetTitle className="text-xl font-semibold py-0">Edit Product</SheetTitle>
                </SheetHeader>

                {loading ? (
                    <div className="flex justify-center items-center py-8 px-6">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="py-4 px-6">
                        <div className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                            <div className="space-y-6">
                                {/* Basic Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="productName" className="mb-2">
                                            Product Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="productName"
                                            value={formData.productName}
                                            onChange={(e) => {
                                                handleInputChange("productName", e.target.value)
                                                if (fieldErrors.productName) {
                                                    setFieldErrors(prev => ({ ...prev, productName: "" }))
                                                }
                                            }}
                                            className={fieldErrors.productName ? "border-red-500 focus:border-red-500" : ""}
                                            placeholder="Enter product name"
                                        />
                                        {fieldErrors.productName && (
                                            <p className="text-sm text-red-500 mt-1">{fieldErrors.productName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="price" className="mb-2">
                                            MRP <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => {
                                                handleInputChange("price", e.target.value)
                                                if (fieldErrors.price) {
                                                    setFieldErrors(prev => ({ ...prev, price: "" }))
                                                }
                                            }}
                                            className={fieldErrors.price ? "border-red-500 focus:border-red-500" : ""}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                        />
                                        {fieldErrors.price && (
                                            <p className="text-sm text-red-500 mt-1">{fieldErrors.price}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="sellinPrice" className="mb-2">
                                            Selling Price <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="sellinPrice"
                                            type="number"
                                            value={formData.sellinPrice}
                                            onChange={(e) => {
                                                handleInputChange("sellinPrice", e.target.value)
                                                if (fieldErrors.sellinPrice) {
                                                    setFieldErrors(prev => ({ ...prev, sellinPrice: "" }))
                                                }
                                            }}
                                            className={fieldErrors.sellinPrice ? "border-red-500 focus:border-red-500" : ""}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                        />
                                        {fieldErrors.sellinPrice && (
                                            <p className="text-sm text-red-500 mt-1">{fieldErrors.sellinPrice}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <FileUpload
                                            label="Product Image"
                                            value={formData.image}
                                            onChange={(url) => handleInputChange("image", url)}
                                            endpoint={UPLOAD_ENDPOINTS.PRODUCT_IMAGE}
                                            disabled={saving}
                                        />
                                    </div>
                                </div>

                                {/* Type-specific Fields */}
                                {formData.type && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {renderTypeSpecificFields()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <SheetFooter className="flex flex-row justify-end gap-3 border-t border-border/40 pt-4 sm:flex-row">
                    <Button variant="outline" onClick={handleClose} disabled={loading || saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading || saving}>
                        {saving ? "Saving..." : "Update Product"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
