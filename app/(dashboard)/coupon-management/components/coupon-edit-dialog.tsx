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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multiselect"
import { LoadingSpinner } from "@/components/ui/loading-components"
import { getCouponById, updateCoupon, getSalesPersons } from "@/services/coupon"
import { Coupon, UpdateCouponRequest, SalesPerson } from "@/types/coupon"
import { useToast } from "@/hooks/use-toast"

interface CouponEditDialogProps {
    couponId: string | null
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

export function CouponEditDialog({ couponId, open, onClose, onSuccess }: CouponEditDialogProps) {
    const { toast } = useToast()
    const [coupon, setCoupon] = useState<Coupon | null>(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [salesPersons, setSalesPersons] = useState<SalesPerson[]>([])
    const [salesPersonOptions, setSalesPersonOptions] = useState<MultiSelectOption[]>([])

    const [formData, setFormData] = useState({
        couponCode: "",
        description: "",
        discountValue: "",
        maxDiscountAmount: "",
        minOrderAmount: "",
        assignedSalesPersons: [] as string[],
        validFrom: "",
        validUntil: "",
        maxUsageCount: "",
        maxUsagePerSalesPerson: "",
        isActive: true,
        status: "active"
    })

    const [fieldErrors, setFieldErrors] = useState({
        couponCode: "",
        description: "",
        discountValue: "",
        maxDiscountAmount: "",
        minOrderAmount: "",
        assignedSalesPersons: "",
        validFrom: "",
        validUntil: "",
        maxUsageCount: "",
        maxUsagePerSalesPerson: ""
    })

    // Load coupon data and salespeople when dialog opens
    useEffect(() => {
        if (couponId && open) {
            setLoading(true)
            setError(null)
            setFieldErrors({
                couponCode: "",
                description: "",
                discountValue: "",
                maxDiscountAmount: "",
                minOrderAmount: "",
                assignedSalesPersons: "",
                validFrom: "",
                validUntil: "",
                maxUsageCount: "",
                maxUsagePerSalesPerson: ""
            })

            // Load both coupon data and salespeople
            Promise.all([
                getCouponById(couponId),
                getSalesPersons()
            ])
                .then(([couponData, salesPersonsResponse]) => {
                    setCoupon(couponData)
                    setSalesPersons(salesPersonsResponse.data || [])

                    // Set up sales person options
                    const options = salesPersonsResponse.data.map(person => ({
                        value: person._id,
                        label: `${person.name} (${person.email})`
                    }))
                    setSalesPersonOptions(options)

                    setFormData({
                        couponCode: couponData.couponCode || "",
                        description: couponData.description || "",
                        discountValue: couponData.discountValue?.toString() || "",
                        maxDiscountAmount: couponData.maxDiscountAmount?.toString() || "",
                        minOrderAmount: couponData.minOrderAmount?.toString() || "",
                        assignedSalesPersons: couponData.assignedSalesPersons?.map(p => p._id) || [],
                        validFrom: couponData.validFrom ? new Date(couponData.validFrom).toISOString().split('T')[0] : "",
                        validUntil: couponData.validUntil ? new Date(couponData.validUntil).toISOString().split('T')[0] : "",
                        maxUsageCount: couponData.maxUsageCount?.toString() || "",
                        maxUsagePerSalesPerson: couponData.maxUsagePerSalesPerson?.toString() || "",
                        isActive: couponData.isActive ?? true,
                        status: couponData.status || "active"
                    })
                })
                .catch((err: unknown) => {
                    const errorMessage = err instanceof Error ? err.message : "Failed to load coupon"
                    setError(errorMessage)
                })
                .finally(() => setLoading(false))
        }
    }, [couponId, open])

    const handleInputChange = (field: keyof typeof formData, value: string | boolean | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const validateForm = () => {
        const errors = {
            couponCode: "",
            description: "",
            discountValue: "",
            maxDiscountAmount: "",
            minOrderAmount: "",
            assignedSalesPersons: "",
            validFrom: "",
            validUntil: "",
            maxUsageCount: "",
            maxUsagePerSalesPerson: ""
        }

        if (!formData.couponCode.trim()) {
            errors.couponCode = "Coupon code is required"
        }

        if (!formData.description.trim()) {
            errors.description = "Description is required"
        }

        if (!formData.discountValue || isNaN(Number(formData.discountValue)) || Number(formData.discountValue) <= 0) {
            errors.discountValue = "Valid discount value is required"
        }

        if (!formData.maxDiscountAmount || isNaN(Number(formData.maxDiscountAmount)) || Number(formData.maxDiscountAmount) <= 0) {
            errors.maxDiscountAmount = "Valid max discount amount is required"
        }

        if (!formData.minOrderAmount || isNaN(Number(formData.minOrderAmount)) || Number(formData.minOrderAmount) < 0) {
            errors.minOrderAmount = "Valid min order amount is required"
        }

        if (formData.assignedSalesPersons.length === 0) {
            errors.assignedSalesPersons = "At least one salesperson must be assigned"
        }

        if (!formData.validFrom) {
            errors.validFrom = "Valid from date is required"
        }

        if (!formData.validUntil) {
            errors.validUntil = "Valid until date is required"
        } else if (formData.validFrom && new Date(formData.validUntil) <= new Date(formData.validFrom)) {
            errors.validUntil = "Valid until date must be after valid from date"
        }

        if (!formData.maxUsageCount || isNaN(Number(formData.maxUsageCount)) || Number(formData.maxUsageCount) <= 0) {
            errors.maxUsageCount = "Valid max usage count is required"
        }

        if (!formData.maxUsagePerSalesPerson || isNaN(Number(formData.maxUsagePerSalesPerson)) || Number(formData.maxUsagePerSalesPerson) <= 0) {
            errors.maxUsagePerSalesPerson = "Valid max usage per salesperson is required"
        }

        setFieldErrors(errors)
        return !Object.values(errors).some(error => error !== "")
    }

    const handleSave = async () => {
        try {
            setSaving(true)

            if (!validateForm()) {
                setSaving(false)
                return
            }

            const updateData: UpdateCouponRequest = {
                couponCode: formData.couponCode.trim(),
                description: formData.description.trim(),
                discountValue: Number(formData.discountValue),
                maxDiscountAmount: Number(formData.maxDiscountAmount),
                minOrderAmount: Number(formData.minOrderAmount),
                assignedSalesPersons: formData.assignedSalesPersons,
                validFrom: formData.validFrom,
                validUntil: formData.validUntil,
                maxUsageCount: Number(formData.maxUsageCount),
                maxUsagePerSalesPerson: Number(formData.maxUsagePerSalesPerson),
                isActive: formData.isActive,
                status: formData.status
            }

            await updateCoupon(couponId!, updateData)

            toast({
                title: "Success",
                description: "Coupon updated successfully",
                variant: "success"
            })

            onSuccess?.()
            onClose()
        } catch (error: unknown) {
            console.error("Error updating coupon:", error)
            toast({
                title: "Error updating coupon",
                description: error instanceof Error ? error.message : 'Unknown error',
                variant: "destructive"
            })
        } finally {
            setSaving(false)
        }
    }

    const resetForm = () => {
        setFormData({
            couponCode: "",
            description: "",
            discountValue: "",
            maxDiscountAmount: "",
            minOrderAmount: "",
            assignedSalesPersons: [],
            validFrom: "",
            validUntil: "",
            maxUsageCount: "",
            maxUsagePerSalesPerson: "",
            isActive: true,
            status: "active"
        })
        setFieldErrors({
            couponCode: "",
            description: "",
            discountValue: "",
            maxDiscountAmount: "",
            minOrderAmount: "",
            assignedSalesPersons: "",
            validFrom: "",
            validUntil: "",
            maxUsageCount: "",
            maxUsagePerSalesPerson: ""
        })
    }

    const handleClose = () => {
        if (saving) return
        resetForm()
        onClose()
    }

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent side="right" className="w-[80vw] sm:w-[70vw] lg:w-[50vw] xl:w-[40vw] max-w-2xl overflow-y-auto rounded-2xl border border-border/40 bg-background text-foreground shadow-lg">
                <SheetHeader className="bg-background/70 backdrop-blur-md border-b border-border/40">
                    <SheetTitle className="text-xl font-semibold py-0">
                        Edit Coupon {coupon?.couponCode && `- ${coupon.couponCode}`}
                    </SheetTitle>
                </SheetHeader>

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <LoadingSpinner message="Loading coupon details..." />
                    </div>
                )}

                {error && (
                    <div className="text-red-600 text-center py-8 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}

                {coupon && !loading && !error && (
                    <div className="py-4 px-6">
                        <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                            <div className="space-y-6">
                                {/* Coupon Code */}
                                <div>
                                    <Label htmlFor="couponCode" className="mb-2">
                                        Coupon Code <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="couponCode"
                                        value={formData.couponCode}
                                        onChange={(e) => {
                                            handleInputChange("couponCode", e.target.value.toUpperCase())
                                            if (fieldErrors.couponCode) {
                                                setFieldErrors(prev => ({ ...prev, couponCode: "" }))
                                            }
                                        }}
                                        placeholder="Enter coupon code (e.g., DIWALI2025)"
                                        disabled={saving}
                                        className={fieldErrors.couponCode ? "border-red-500 focus:border-red-500" : ""}
                                    />
                                    {fieldErrors.couponCode && (
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.couponCode}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <Label htmlFor="description" className="mb-2">
                                        Description <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => {
                                            handleInputChange("description", e.target.value)
                                            if (fieldErrors.description) {
                                                setFieldErrors(prev => ({ ...prev, description: "" }))
                                            }
                                        }}
                                        placeholder="Enter coupon description"
                                        rows={3}
                                        disabled={saving}
                                        className={fieldErrors.description ? "border-red-500 focus:border-red-500" : ""}
                                    />
                                    {fieldErrors.description && (
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.description}</p>
                                    )}
                                </div>

                                {/* Discount Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="discountValue" className="mb-2">
                                            Discount Value (%) <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="discountValue"
                                            type="number"
                                            value={formData.discountValue}
                                            onChange={(e) => {
                                                handleInputChange("discountValue", e.target.value)
                                                if (fieldErrors.discountValue) {
                                                    setFieldErrors(prev => ({ ...prev, discountValue: "" }))
                                                }
                                            }}
                                            placeholder="Enter discount percentage"
                                            disabled={saving}
                                            className={fieldErrors.discountValue ? "border-red-500 focus:border-red-500" : ""}
                                        />
                                        {fieldErrors.discountValue && (
                                            <p className="text-sm text-red-500 mt-1">{fieldErrors.discountValue}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="maxDiscountAmount" className="mb-2">
                                            Max Discount Amount (₹) <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="maxDiscountAmount"
                                            type="number"
                                            value={formData.maxDiscountAmount}
                                            onChange={(e) => {
                                                handleInputChange("maxDiscountAmount", e.target.value)
                                                if (fieldErrors.maxDiscountAmount) {
                                                    setFieldErrors(prev => ({ ...prev, maxDiscountAmount: "" }))
                                                }
                                            }}
                                            placeholder="Enter max discount amount"
                                            disabled={saving}
                                            className={fieldErrors.maxDiscountAmount ? "border-red-500 focus:border-red-500" : ""}
                                        />
                                        {fieldErrors.maxDiscountAmount && (
                                            <p className="text-sm text-red-500 mt-1">{fieldErrors.maxDiscountAmount}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="minOrderAmount" className="mb-2">
                                            Min Order Amount (₹) <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="minOrderAmount"
                                            type="number"
                                            value={formData.minOrderAmount}
                                            onChange={(e) => {
                                                handleInputChange("minOrderAmount", e.target.value)
                                                if (fieldErrors.minOrderAmount) {
                                                    setFieldErrors(prev => ({ ...prev, minOrderAmount: "" }))
                                                }
                                            }}
                                            placeholder="Enter minimum order amount"
                                            disabled={saving}
                                            className={fieldErrors.minOrderAmount ? "border-red-500 focus:border-red-500" : ""}
                                        />
                                        {fieldErrors.minOrderAmount && (
                                            <p className="text-sm text-red-500 mt-1">{fieldErrors.minOrderAmount}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Assigned Sales Persons */}
                                <div>
                                    <Label className="mb-2">
                                        Assigned Sales Persons <span className="text-red-500">*</span>
                                    </Label>
                                    <div className={fieldErrors.assignedSalesPersons ? "border border-red-500 rounded-md" : ""}>
                                        <MultiSelect
                                            options={salesPersonOptions}
                                            value={formData.assignedSalesPersons}
                                            onValueChange={(value: string[]) => {
                                                handleInputChange("assignedSalesPersons", value)
                                                if (fieldErrors.assignedSalesPersons) {
                                                    setFieldErrors(prev => ({ ...prev, assignedSalesPersons: "" }))
                                                }
                                            }}
                                            placeholder="Select salespeople to assign"
                                            disabled={saving}
                                        />
                                    </div>
                                    {fieldErrors.assignedSalesPersons && (
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.assignedSalesPersons}</p>
                                    )}
                                </div>

                                {/* Validity Period */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="validFrom" className="mb-2">
                                            Valid From <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="validFrom"
                                            type="date"
                                            value={formData.validFrom}
                                            onChange={(e) => {
                                                handleInputChange("validFrom", e.target.value)
                                                if (fieldErrors.validFrom) {
                                                    setFieldErrors(prev => ({ ...prev, validFrom: "" }))
                                                }
                                            }}
                                            disabled={saving}
                                            className={fieldErrors.validFrom ? "border-red-500 focus:border-red-500" : ""}
                                        />
                                        {fieldErrors.validFrom && (
                                            <p className="text-sm text-red-500 mt-1">{fieldErrors.validFrom}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="validUntil" className="mb-2">
                                            Valid Until <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="validUntil"
                                            type="date"
                                            value={formData.validUntil}
                                            onChange={(e) => {
                                                handleInputChange("validUntil", e.target.value)
                                                if (fieldErrors.validUntil) {
                                                    setFieldErrors(prev => ({ ...prev, validUntil: "" }))
                                                }
                                            }}
                                            disabled={saving}
                                            className={fieldErrors.validUntil ? "border-red-500 focus:border-red-500" : ""}
                                        />
                                        {fieldErrors.validUntil && (
                                            <p className="text-sm text-red-500 mt-1">{fieldErrors.validUntil}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Usage Limits */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="maxUsageCount" className="mb-2">
                                            Max Usage Count <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="maxUsageCount"
                                            type="number"
                                            value={formData.maxUsageCount}
                                            onChange={(e) => {
                                                handleInputChange("maxUsageCount", e.target.value)
                                                if (fieldErrors.maxUsageCount) {
                                                    setFieldErrors(prev => ({ ...prev, maxUsageCount: "" }))
                                                }
                                            }}
                                            placeholder="Enter max usage count"
                                            disabled={saving}
                                            className={fieldErrors.maxUsageCount ? "border-red-500 focus:border-red-500" : ""}
                                        />
                                        {fieldErrors.maxUsageCount && (
                                            <p className="text-sm text-red-500 mt-1">{fieldErrors.maxUsageCount}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="maxUsagePerSalesPerson" className="mb-2">
                                            Max Usage Per Salesperson <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="maxUsagePerSalesPerson"
                                            type="number"
                                            value={formData.maxUsagePerSalesPerson}
                                            onChange={(e) => {
                                                handleInputChange("maxUsagePerSalesPerson", e.target.value)
                                                if (fieldErrors.maxUsagePerSalesPerson) {
                                                    setFieldErrors(prev => ({ ...prev, maxUsagePerSalesPerson: "" }))
                                                }
                                            }}
                                            placeholder="Enter max usage per salesperson"
                                            disabled={saving}
                                            className={fieldErrors.maxUsagePerSalesPerson ? "border-red-500 focus:border-red-500" : ""}
                                        />
                                        {fieldErrors.maxUsagePerSalesPerson && (
                                            <p className="text-sm text-red-500 mt-1">{fieldErrors.maxUsagePerSalesPerson}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Read-only validity and usage info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="mb-2">Valid From (Read-only)</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm text-muted-foreground">
                                            {new Date(coupon.validFrom).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="mb-2">Valid Until (Read-only)</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm text-muted-foreground">
                                            {new Date(coupon.validUntil).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Status Control */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isActive"
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) => {
                                            handleInputChange("isActive", !!checked)
                                        }}
                                        disabled={saving}
                                    />
                                    <Label htmlFor="isActive">
                                        Active (coupon will be available for use)
                                    </Label>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                <SheetFooter className="flex flex-row justify-end gap-3 border-t border-border/40 pt-4 sm:flex-row">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving || loading || !!error}
                    >
                        {saving ? "Updating..." : "Update Coupon"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}