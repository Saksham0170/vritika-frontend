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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multiselect"
import { createCoupon, getSalesPersons } from "@/services/coupon"
import { CreateCouponRequest, SalesPerson } from "@/types/coupon"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

interface CouponAddDialogProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

export function CouponAddDialog({ open, onClose, onSuccess }: CouponAddDialogProps) {
    const { toast } = useToast()
    const [saving, setSaving] = useState(false)
    const [salesPersons, setSalesPersons] = useState<SalesPerson[]>([])
    const [salesPersonOptions, setSalesPersonOptions] = useState<MultiSelectOption[]>([])

    const [formData, setFormData] = useState({
        couponCode: "",
        description: "",
        discountType: "percentage" as const,
        discountValue: "",
        maxDiscountAmount: "",
        minOrderAmount: "",
        assignedSalesPersons: [] as string[],
        validFrom: "",
        validUntil: "",
        maxUsageCount: "",
        maxUsagePerSalesPerson: "",
        isActive: true
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

    // Load salespeople when dialog opens
    useEffect(() => {
        if (open) {
            loadSalesPersons()
        }
    }, [open])

    const loadSalesPersons = async () => {
        try {
            const response = await getSalesPersons()
            const salesPersonsData = response.data?.data || []
            setSalesPersons(salesPersonsData)

            const options = salesPersonsData.map(person => ({
                value: person._id,
                label: `${person.name} (${person.email})`
            }))
            setSalesPersonOptions(options)
        } catch (error) {
            console.error("Error loading salespeople:", error)
            toast({
                title: "Error",
                description: "Failed to load salespeople",
                variant: "destructive"
            })
        }
    }

    const handleInputChange = (field: keyof typeof formData, value: string | string[] | boolean) => {
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

        if (!formData.minOrderAmount || isNaN(Number(formData.minOrderAmount)) || Number(formData.minOrderAmount) <= 0) {
            errors.minOrderAmount = "Valid minimum order amount is required"
        }

        if (formData.assignedSalesPersons.length === 0) {
            errors.assignedSalesPersons = "At least one salesperson must be assigned"
        }

        if (!formData.validFrom) {
            errors.validFrom = "Valid from date is required"
        }

        if (!formData.validUntil) {
            errors.validUntil = "Valid until date is required"
        } else if (formData.validFrom && formData.validUntil && new Date(formData.validUntil) <= new Date(formData.validFrom)) {
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

            const couponData: CreateCouponRequest = {
                couponCode: formData.couponCode.trim(),
                description: formData.description.trim(),
                discountType: formData.discountType,
                discountValue: Number(formData.discountValue),
                maxDiscountAmount: Number(formData.maxDiscountAmount),
                minOrderAmount: Number(formData.minOrderAmount),
                assignedSalesPersons: formData.assignedSalesPersons,
                validFrom: formData.validFrom,
                validUntil: formData.validUntil,
                maxUsageCount: Number(formData.maxUsageCount),
                maxUsagePerSalesPerson: Number(formData.maxUsagePerSalesPerson),
                isActive: formData.isActive
            }

            await createCoupon(couponData)

            toast({
                title: "Success",
                description: "Coupon created successfully",
                variant: "success"
            })

            resetForm()
            onSuccess?.()
            onClose()
        } catch (error: unknown) {
            console.error("Error creating coupon:", error)
            toast({
                title: "Error creating coupon",
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
            discountType: "percentage",
            discountValue: "",
            maxDiscountAmount: "",
            minOrderAmount: "",
            assignedSalesPersons: [],
            validFrom: "",
            validUntil: "",
            maxUsageCount: "",
            maxUsagePerSalesPerson: "",
            isActive: true
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
                    <SheetTitle className="text-xl font-semibold py-0">Add New Coupon</SheetTitle>
                </SheetHeader>

                <div className="py-4 px-6">
                    <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                        <div className="space-y-6">
                            {/* Basic Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        placeholder="e.g., DIWALI2025"
                                        disabled={saving}
                                        className={fieldErrors.couponCode ? "border-red-500 focus:border-red-500" : ""}
                                    />
                                    {fieldErrors.couponCode && (
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.couponCode}</p>
                                    )}
                                </div>

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
                            </div>

                            {/* Discount Amounts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                            {/* Assigned Sales Persons */}
                            <div>
                                <Label className="mb-2">
                                    Assigned Sales Persons <span className="text-red-500">*</span>
                                </Label>
                                <div className={fieldErrors.assignedSalesPersons ? "border border-red-500 rounded-md" : ""}>
                                    <MultiSelect
                                        options={salesPersonOptions}
                                        value={formData.assignedSalesPersons}
                                        onValueChange={(value) => {
                                            handleInputChange("assignedSalesPersons", value)
                                            if (fieldErrors.assignedSalesPersons) {
                                                setFieldErrors(prev => ({ ...prev, assignedSalesPersons: "" }))
                                            }
                                        }}
                                        placeholder="Select salespeople..."
                                        searchPlaceholder="Search salespeople..."
                                        disabled={saving}
                                    />
                                </div>
                                {fieldErrors.assignedSalesPersons && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.assignedSalesPersons}</p>
                                )}
                            </div>

                            {/* Date Range */}
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

                            {/* Active Status */}
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
                        disabled={saving}
                    >
                        {saving ? "Creating..." : "Create Coupon"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}