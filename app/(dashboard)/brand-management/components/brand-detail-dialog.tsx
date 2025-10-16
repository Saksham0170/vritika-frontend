"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-components"
import { getBrandById } from "@/services/brand"
import { Brand } from "@/types/brand"

interface BrandDetailDialogProps {
    brandId: string | null
    open: boolean
    onClose: () => void
}

export function BrandDetailDialog({ brandId, open, onClose }: BrandDetailDialogProps) {
    const [brand, setBrand] = useState<Brand | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (brandId && open) {
            setLoading(true)
            setError(null)
            getBrandById(brandId)
                .then(setBrand)
                .catch((err: unknown) => {
                    const errorMessage = err instanceof Error ? err.message : "Failed to load brand details"
                    setError(errorMessage)
                })
                .finally(() => setLoading(false))
        }
    }, [brandId, open])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Brand Details</DialogTitle>
                </DialogHeader>

                {loading && <LoadingSpinner message="Loading brand details..." />}

                {error && (
                    <div className="text-red-600 text-center py-4">{error}</div>
                )}

                {brand && !loading && !error && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Brand Name</label>
                                <div className="text-sm font-semibold">{brand.brandName}</div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Quality</label>
                                <div className="text-sm">
                                    <Badge variant={brand.quality === "Premium" ? "default" : "secondary"}>
                                        {brand.quality}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Brand Details</label>
                            <div className="text-sm mt-1 p-3 bg-muted rounded-md">
                                {brand.brandDetails || "No details available"}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Product Categories</label>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {brand.productCategory?.map((category, index) => (
                                    <Badge key={index} variant="outline">
                                        {category}
                                    </Badge>
                                ))}
                            </div>
                        </div>



                        {(brand.createdAt || brand.updatedAt) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                {brand.createdAt && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Created At</label>
                                        <div className="text-sm">{new Date(brand.createdAt).toLocaleString()}</div>
                                    </div>
                                )}
                                {brand.updatedAt && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Updated At</label>
                                        <div className="text-sm">{new Date(brand.updatedAt).toLocaleString()}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}