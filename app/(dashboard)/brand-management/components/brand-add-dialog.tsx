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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multiselect"
import { createBrand } from "@/services/brand"
import { CreateBrandRequest } from "@/types/brand"


interface BrandAddDialogProps {
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

export function BrandAddDialog({ open, onClose, onSuccess }: BrandAddDialogProps) {
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        brandName: "",
        brandDetails: "",
        productCategory: [] as string[],
        quality: "",
    })

    const [fieldErrors, setFieldErrors] = useState({
        brandName: "",
        brandDetails: "",
        quality: "",
        productCategory: ""
    })

    const handleInputChange = (field: keyof typeof formData, value: string | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

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
        try {
            setSaving(true)

            if (!validateForm()) {
                setSaving(false)
                return
            }

            // Convert selected values back to labels for API
            const selectedLabels = formData.productCategory.map(value => {
                const option = categoryOptions.find(opt => opt.value === value)
                return option ? option.label : value
            })

            const brandData: CreateBrandRequest = {
                brandName: formData.brandName.trim(),
                brandDetails: formData.brandDetails.trim(),
                productCategory: selectedLabels,
                quality: formData.quality,
            }

            await createBrand(brandData)

            // Reset form
            setFormData({
                brandName: "",
                brandDetails: "",
                productCategory: [],
                quality: "",
            })

            onSuccess?.()
            onClose()
        } catch (error: unknown) {
            console.error("Error creating brand:", error)
            // Handle error silently
        } finally {
            setSaving(false)
        }
    }

    const handleClose = () => {
        if (saving) return

        // Reset form
        setFormData({
            brandName: "",
            brandDetails: "",
            productCategory: [],
            quality: "",
        })
        setFieldErrors({
            brandName: "",
            brandDetails: "",
            quality: "",
            productCategory: ""
        })
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/40 bg-background text-foreground shadow-lg">
                <DialogHeader className="bg-background/70 backdrop-blur-md border-b border-border/40">
                    <DialogTitle className="text-xl font-semibold py-0">Add New Brand</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {/* ---------- Brand Information ---------- */}
                    <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                        <div className="space-y-6">
                            {/* Basic Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="brandName" className="mb-2">
                                        Brand Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="brandName"
                                        value={formData.brandName}
                                        onChange={(e) => {
                                            handleInputChange("brandName", e.target.value)
                                            if (fieldErrors.brandName) {
                                                setFieldErrors(prev => ({ ...prev, brandName: "" }))
                                            }
                                        }}
                                        placeholder="Enter brand name"
                                        disabled={saving}
                                        className={fieldErrors.brandName ? "border-red-500 focus:border-red-500" : ""}
                                    />
                                    {fieldErrors.brandName && (
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.brandName}</p>
                                    )}
                                </div>

                                <div data-field="quality">
                                    <Label htmlFor="quality" className="mb-2">
                                        Quality <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.quality}
                                        onValueChange={(value) => {
                                            handleInputChange("quality", value)
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
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.quality}</p>
                                    )}
                                </div>
                            </div>

                            {/* Brand Description */}
                            <div>
                                <Label htmlFor="brandDetails" className="mb-2">
                                    Brand Details <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="brandDetails"
                                    value={formData.brandDetails}
                                    onChange={(e) => {
                                        handleInputChange("brandDetails", e.target.value)
                                        if (fieldErrors.brandDetails) {
                                            setFieldErrors(prev => ({ ...prev, brandDetails: "" }))
                                        }
                                    }}
                                    placeholder="Enter brand details and description"
                                    rows={4}
                                    disabled={saving}
                                    className={fieldErrors.brandDetails ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {fieldErrors.brandDetails && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.brandDetails}</p>
                                )}
                            </div>

                            {/* Product Categories */}
                            <div data-field="productCategory">
                                <Label className="mb-2">
                                    Product Categories <span className="text-red-500">*</span>
                                </Label>
                                <div className={fieldErrors.productCategory ? "border border-red-500 rounded-md" : ""}>
                                    <MultiSelect
                                        options={categoryOptions}
                                        value={formData.productCategory}
                                        onValueChange={(value) => {
                                            handleInputChange("productCategory", value)
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
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.productCategory}</p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                <DialogFooter className="flex justify-end gap-3 border-t border-border/40 pt-4">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Creating..." : "Create Brand"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}