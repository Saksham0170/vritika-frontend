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
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-components"
import { getCouponById } from "@/services/coupon"
import { Coupon } from "@/types/coupon"

interface CouponDetailDialogProps {
    couponId: string | null
    open: boolean
    onClose: () => void
}

export function CouponDetailDialog({ couponId, open, onClose }: CouponDetailDialogProps) {
    const [coupon, setCoupon] = useState<Coupon | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (couponId && open) {
            setLoading(true)
            setError(null)
            getCouponById(couponId)
                .then(setCoupon)
                .catch((err: unknown) => {
                    const errorMessage = err instanceof Error ? err.message : "Failed to load coupon details"
                    setError(errorMessage)
                })
                .finally(() => setLoading(false))
        }
    }, [couponId, open])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString()
    }

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="right" className="w-[80vw] sm:w-[70vw] lg:w-[50vw] xl:w-[40vw] max-w-2xl overflow-y-auto rounded-2xl border border-border/40 bg-zinc-100 dark:bg-background text-foreground shadow-lg">
                <SheetHeader className="bg-zinc-100/70 dark:bg-background/70 backdrop-blur-md border-b border-border/40">
                    <SheetTitle className="text-xl font-semibold py-0">Coupon Details</SheetTitle>
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
                        {/* ---------- Coupon Information ---------- */}
                        <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                            <div className="space-y-6">
                                {/* Basic Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="mb-2">Coupon Code</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-bold">
                                            {coupon.couponCode}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="mb-2">Status</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                            <Badge
                                                variant="outline"
                                                className={`${coupon.isActive && coupon.status === "active"
                                                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800/30"
                                                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800/30"
                                                    }`}
                                            >
                                                {coupon.isActive && coupon.status === "active" ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <Label className="mb-2">Description</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm min-h-[60px]">
                                        {coupon.description || "No description available"}
                                    </div>
                                </div>

                                {/* Discount Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="mb-2">Discount Value</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-medium">
                                            {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="mb-2">Max Discount Amount</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-medium">
                                            ₹{coupon.maxDiscountAmount}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="mb-2">Min Order Amount</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-medium">
                                            ₹{coupon.minOrderAmount}
                                        </div>
                                    </div>
                                </div>

                                {/* Validity Period */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="mb-2">Valid From</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                            {formatDate(coupon.validFrom)}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="mb-2">Valid Until</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                            <span className={new Date(coupon.validUntil) < new Date() ? 'text-red-600' : ''}>
                                                {formatDate(coupon.validUntil)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Usage Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="mb-2">Usage Count</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                            {coupon.currentUsageCount} / {coupon.maxUsageCount}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="mb-2">Max Usage Per Salesperson</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                            {coupon.maxUsagePerSalesPerson}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="mb-2">Remaining Uses</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-medium">
                                            {coupon.maxUsageCount - coupon.currentUsageCount}
                                        </div>
                                    </div>
                                </div>

                                {/* Assigned Sales Persons */}
                                <div>
                                    <Label className="mb-2">Assigned Sales Persons</Label>
                                    <div className="flex flex-wrap gap-2 mt-2 p-3 bg-muted/50 rounded-md border border-border/30 min-h-[50px]">
                                        {coupon.assignedSalesPersons?.length ? (
                                            coupon.assignedSalesPersons.map((person, index) => (
                                                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/30">
                                                    {person.name} ({person.email})
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-muted-foreground text-sm">No salespeople assigned</span>
                                        )}
                                    </div>
                                </div>

                                {/* Timestamps */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="mb-2">Created At</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm text-muted-foreground">
                                            {formatDateTime(coupon.createdAt)}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="mb-2">Last Updated</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm text-muted-foreground">
                                            {formatDateTime(coupon.updatedAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                <SheetFooter className="flex flex-row justify-end gap-3 border-t border-border/40 pt-4 sm:flex-row">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}