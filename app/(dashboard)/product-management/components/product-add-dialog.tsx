"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
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
import { createProduct } from "@/services/product"
import { CreateProductRequest, ProductType } from "@/types/product"

interface ProductAddDialogProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

const productTypes: ProductType[] = ["BOS", "Kit", "Solar Module", "Inverter", "Structure"]

const phaseOptions = [
    "Single Phase",
    "Three Phase"
]

export function ProductAddDialog({ open, onClose, onSuccess }: ProductAddDialogProps) {
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        productName: "",
        type: "" as ProductType | "",
        price: "",
        // Optional fields
        image: "",
        spvBrand: "",
        spvType: "",
        phase: "",
        capacity: "",
        spvCapacity: "",
        service: "",
        thickness: "",
    })

    const [fieldErrors, setFieldErrors] = useState({
        productName: "",
        type: "",
        price: ""
    })

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const validateForm = () => {
        const errors = {
            productName: "",
            type: "",
            price: ""
        }

        if (!formData.productName.trim()) {
            errors.productName = "Product name is required"
        }

        if (!formData.type) {
            errors.type = "Product type is required"
        }

        if (!formData.price.trim()) {
            errors.price = "Price is required"
        } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            errors.price = "Price must be a valid positive number"
        }

        setFieldErrors(errors)

        // Focus on first field with error
        const hasErrors = Object.values(errors).some(error => error !== "")
        if (hasErrors) {
            setTimeout(() => {
                if (errors.productName) {
                    document.getElementById("productName")?.focus()
                } else if (errors.type) {
                    (document.querySelector('[data-field="type"] button') as HTMLButtonElement)?.focus()
                } else if (errors.price) {
                    document.getElementById("price")?.focus()
                }
            }, 100)
        }

        return !hasErrors
    }

    const handleSave = async () => {
        try {
            setSaving(true)

            if (!validateForm()) {
                setSaving(false)
                return
            }

            const productData: CreateProductRequest = {
                productName: formData.productName.trim(),
                type: formData.type as ProductType,
                price: Number(formData.price),
                // Optional fields
                image: formData.image.trim() || undefined,
                spvBrand: formData.spvBrand.trim() || undefined,
                spvType: formData.spvType.trim() || undefined,
                phase: formData.phase || undefined,
                capacity: formData.capacity.trim() || undefined,
                spvCapacity: formData.spvCapacity.trim() || undefined,
                service: formData.service.trim() || undefined,
                thickness: formData.thickness.trim() || undefined,
            }

            await createProduct(productData)

            // Reset form
            setFormData({
                productName: "",
                type: "",
                price: "",
                image: "",
                spvBrand: "",
                spvType: "",
                phase: "",
                capacity: "",
                spvCapacity: "",
                service: "",
                thickness: "",
            })

            onSuccess?.()
            onClose()
        } catch (error: unknown) {
            console.error("Error creating product:", error)
            // Handle error silently
        } finally {
            setSaving(false)
        }
    }

    const handleClose = () => {
        if (saving) return

        // Reset form
        setFormData({
            productName: "",
            type: "",
            price: "",
            image: "",
            spvBrand: "",
            spvType: "",
            phase: "",
            capacity: "",
            spvCapacity: "",
            service: "",
            thickness: "",
        })
        setFieldErrors({
            productName: "",
            type: "",
            price: ""
        })
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/40 bg-background text-foreground shadow-lg">
                <DialogHeader className="bg-background/70 backdrop-blur-md border-b border-border/40">
                    <DialogTitle className="text-xl font-semibold py-0">Add New Product</DialogTitle>
                </DialogHeader>

                <div className="py-4">
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
                                    <Label className="mb-2">
                                        Product Type <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) => {
                                            handleInputChange("type", value)
                                            if (fieldErrors.type) {
                                                setFieldErrors(prev => ({ ...prev, type: "" }))
                                            }
                                        }}
                                    >
                                        <SelectTrigger 
                                            className={fieldErrors.type ? "border-red-500 focus:border-red-500" : ""}
                                            data-field="type"
                                        >
                                            <SelectValue placeholder="Select product type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {productTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldErrors.type && (
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.type}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="price" className="mb-2">
                                        Price <span className="text-red-500">*</span>
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
                                    <Label htmlFor="image" className="mb-2">
                                        Image URL
                                    </Label>
                                    <Input
                                        id="image"
                                        value={formData.image}
                                        onChange={(e) => handleInputChange("image", e.target.value)}
                                        placeholder="Enter image URL"
                                    />
                                </div>
                            </div>

                            {/* Optional Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="spvBrand" className="mb-2">
                                        SPV Brand
                                    </Label>
                                    <Input
                                        id="spvBrand"
                                        value={formData.spvBrand}
                                        onChange={(e) => handleInputChange("spvBrand", e.target.value)}
                                        placeholder="Enter SPV brand"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="spvType" className="mb-2">
                                        SPV Type
                                    </Label>
                                    <Input
                                        id="spvType"
                                        value={formData.spvType}
                                        onChange={(e) => handleInputChange("spvType", e.target.value)}
                                        placeholder="Enter SPV type"
                                    />
                                </div>

                                <div>
                                    <Label className="mb-2">
                                        Phase
                                    </Label>
                                    <Select
                                        value={formData.phase}
                                        onValueChange={(value) => handleInputChange("phase", value)}
                                    >
                                        <SelectTrigger>
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
                                        Capacity
                                    </Label>
                                    <Input
                                        id="capacity"
                                        value={formData.capacity}
                                        onChange={(e) => handleInputChange("capacity", e.target.value)}
                                        placeholder="Enter capacity"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="spvCapacity" className="mb-2">
                                        SPV Capacity
                                    </Label>
                                    <Input
                                        id="spvCapacity"
                                        value={formData.spvCapacity}
                                        onChange={(e) => handleInputChange("spvCapacity", e.target.value)}
                                        placeholder="Enter SPV capacity"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="service" className="mb-2">
                                        Service
                                    </Label>
                                    <Input
                                        id="service"
                                        value={formData.service}
                                        onChange={(e) => handleInputChange("service", e.target.value)}
                                        placeholder="Enter service"
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
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex justify-end space-x-2 border-t border-border/40 bg-background/70 backdrop-blur-md">
                    <Button variant="outline" onClick={handleClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Product"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}