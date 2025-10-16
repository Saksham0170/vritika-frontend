"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multiselect"
import { LoadingSpinner } from "@/components/ui/loading-components"
import { getBrandById, updateBrand } from "@/services/brand"
import { Brand, UpdateBrandRequest } from "@/types/brand"


interface BrandEditDialogProps {
    brandId: string | null
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

const qualityOptions = [
    "Premium",
    "Standard",
    "Economy",
    "Luxury",
    "Basic"
]

const categoryOptions: MultiSelectOption[] = [
    { value: "solar-module", label: "Solar Module" },
    { value: "inverter", label: "Inverter" },
    { value: "batteries", label: "Batteries" },
    { value: "cables", label: "Cables" },
    { value: "structure", label: "Structure" }
]

export function BrandEditDialog({ brandId, open, onClose, onSuccess }: BrandEditDialogProps) {
    const [brand, setBrand] = useState<Brand | null>(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        brandName: "",
        brandDetails: "",
        quality: "",
        productCategory: [] as string[]
    })

    const [fieldErrors, setFieldErrors] = useState({
        brandName: "",
        brandDetails: "",
        quality: "",
        productCategory: ""
    })



    useEffect(() => {
        if (brandId && open) {
            setLoading(true)
            setError(null)
            setFieldErrors({
                brandName: "",
                brandDetails: "",
                quality: "",
                productCategory: ""
            })
            getBrandById(brandId)
                .then((brandData) => {
                    setBrand(brandData)

                    // Convert labels to values for the MultiSelect
                    const categoryValues = (brandData.productCategory || []).map(label => {
                        const option = categoryOptions.find(opt => opt.label === label)
                        return option ? option.value : label
                    })

                    setFormData({
                        brandName: brandData.brandName || "",
                        brandDetails: brandData.brandDetails || "",
                        quality: brandData.quality || "",
                        productCategory: categoryValues
                    })
                })
                .catch((err: unknown) => {
                    const errorMessage = err instanceof Error ? err.message : "Failed to load brand"
                    setError(errorMessage)
                })
                .finally(() => setLoading(false))
        }
    }, [brandId, open])

    const validateForm = () => {
        const errors = {
            brandName: "",
            brandDetails: "",
            quality: "",
            productCategory: ""
        }

        if (!formData.brandName.trim()) {
            errors.brandName = "Brand name is required"
        }

        if (!formData.brandDetails.trim()) {
            errors.brandDetails = "Brand details is required"
        }

        if (!formData.quality) {
            errors.quality = "Quality is required"
        }

        if (formData.productCategory.length === 0) {
            errors.productCategory = "At least one product category is required"
        }

        setFieldErrors(errors)

        // Focus on first field with error
        const hasErrors = Object.values(errors).some(error => error !== "")
        if (hasErrors) {
            setTimeout(() => {
                if (errors.brandName) {
                    document.getElementById("brandName")?.focus()
                } else if (errors.brandDetails) {
                    document.getElementById("brandDetails")?.focus()
                } else if (errors.quality) {
                    (document.querySelector('[data-field="quality"] button') as HTMLButtonElement)?.focus()
                } else if (errors.productCategory) {
                    (document.querySelector('[data-field="productCategory"] button') as HTMLButtonElement)?.focus()
                }
            }, 100)
        }

        return !hasErrors
    }

    const handleSave = async () => {
        if (!brandId || !brand) return

        if (!validateForm()) {
            return
        }

        setSaving(true)
        try {
            const updateData: UpdateBrandRequest = {}

            if (formData.brandName !== brand.brandName) updateData.brandName = formData.brandName
            if (formData.brandDetails !== brand.brandDetails) updateData.brandDetails = formData.brandDetails
            if (formData.quality !== brand.quality) updateData.quality = formData.quality

            // Convert selected values back to labels for API
            const selectedLabels = formData.productCategory.map(value => {
                const option = categoryOptions.find(opt => opt.value === value)
                return option ? option.label : value
            })

            if (JSON.stringify(selectedLabels) !== JSON.stringify(brand.productCategory)) {
                updateData.productCategory = selectedLabels
            }

            await updateBrand(brandId, updateData)
            onSuccess?.()
            onClose()
        } catch {
            // Handle error silently
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Brand</DialogTitle>
                </DialogHeader>

                {loading && <LoadingSpinner message="Loading brand..." />}

                {error && (
                    <div className="text-red-600 text-center py-4">{error}</div>
                )}

                {brand && !loading && !error && (
                    <div className="grid gap-4 py-4">
                        {/* Brand Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="brandName">
                                Brand Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="brandName"
                                value={formData.brandName}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, brandName: e.target.value }))
                                    if (fieldErrors.brandName) {
                                        setFieldErrors(prev => ({ ...prev, brandName: "" }))
                                    }
                                }}
                                placeholder="Enter brand name"
                                disabled={saving}
                                className={fieldErrors.brandName ? "border-red-500 focus:border-red-500" : ""}
                            />
                            {fieldErrors.brandName && (
                                <p className="text-sm text-red-500">{fieldErrors.brandName}</p>
                            )}
                        </div>

                        {/* Brand Details */}
                        <div className="grid gap-2">
                            <Label htmlFor="brandDetails">
                                Brand Details <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="brandDetails"
                                value={formData.brandDetails}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    setFormData(prev => ({ ...prev, brandDetails: e.target.value }))
                                    if (fieldErrors.brandDetails) {
                                        setFieldErrors(prev => ({ ...prev, brandDetails: "" }))
                                    }
                                }}
                                placeholder="Enter brand details and description"
                                rows={3}
                                disabled={saving}
                                className={fieldErrors.brandDetails ? "border-red-500 focus:border-red-500" : ""}
                            />
                            {fieldErrors.brandDetails && (
                                <p className="text-sm text-red-500">{fieldErrors.brandDetails}</p>
                            )}
                        </div>

                        {/* Quality */}
                        <div className="grid gap-2" data-field="quality">
                            <Label htmlFor="quality">
                                Quality <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.quality}
                                onValueChange={(value) => {
                                    setFormData(prev => ({ ...prev, quality: value }))
                                    if (fieldErrors.quality) {
                                        setFieldErrors(prev => ({ ...prev, quality: "" }))
                                    }
                                }}
                                disabled={saving}
                            >
                                <SelectTrigger className={fieldErrors.quality ? "border-red-500 focus:border-red-500" : ""}>
                                    <SelectValue placeholder="Select quality level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {qualityOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {fieldErrors.quality && (
                                <p className="text-sm text-red-500">{fieldErrors.quality}</p>
                            )}
                        </div>

                        {/* Product Categories */}
                        <div className="grid gap-2" data-field="productCategory">
                            <Label>
                                Product Categories <span className="text-red-500">*</span>
                            </Label>
                            <div className={fieldErrors.productCategory ? "border border-red-500 rounded-md" : ""}>
                                <MultiSelect
                                    options={categoryOptions}
                                    value={formData.productCategory}
                                    onValueChange={(value) => {
                                        setFormData(prev => ({ ...prev, productCategory: value }))
                                        if (fieldErrors.productCategory) {
                                            setFieldErrors(prev => ({ ...prev, productCategory: "" }))
                                        }
                                    }}
                                    placeholder="Select product categories..."
                                    searchPlaceholder="Search categories..."
                                    disabled={saving}
                                />
                            </div>
                            {fieldErrors.productCategory && (
                                <p className="text-sm text-red-500">{fieldErrors.productCategory}</p>
                            )}
                        </div>
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving || loading}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}