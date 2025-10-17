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
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="right" className="w-[80vw] sm:w-[70vw] lg:w-[50vw] xl:w-[40vw] max-w-2xl overflow-y-auto rounded-2xl border border-border/40 bg-zinc-100 dark:bg-background text-foreground shadow-lg">
                <SheetHeader className="bg-zinc-100/70 dark:bg-background/70 backdrop-blur-md border-b border-border/40">
                    <SheetTitle className="text-xl font-semibold py-0">Brand Details</SheetTitle>
                </SheetHeader>

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <LoadingSpinner message="Loading brand details..." />
                    </div>
                )}

                {error && (
                    <div className="text-red-600 text-center py-8 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}

                {brand && !loading && !error && (
                    <div className="py-4 px-6">
                        {/* ---------- Brand Information ---------- */}
                        <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                            <div className="space-y-6">
                                {/* Basic Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="mb-2">Brand Name</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-medium">
                                            {brand.brandName}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="mb-2">Quality</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                            <Badge variant={brand.quality === "Premium" ? "default" : "secondary"}>
                                                {brand.quality}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Brand Description */}
                                <div>
                                    <Label className="mb-2">Brand Details</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm min-h-[80px]">
                                        {brand.brandDetails || "No details available"}
                                    </div>
                                </div>

                                {/* Product Categories */}
                                <div>
                                    <Label className="mb-2">Product Categories</Label>
                                    <div className="flex flex-wrap gap-2 mt-2 p-3 bg-muted/50 rounded-md border border-border/30 min-h-[50px]">
                                        {brand.productCategory?.length ? (
                                            brand.productCategory.map((category, index) => (
                                                <Badge key={index} variant="outline" className="bg-background/50">
                                                    {category}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-muted-foreground text-sm">No categories assigned</span>
                                        )}
                                    </div>
                                </div>

                                {/* Timestamps */}
                                {(brand.createdAt || brand.updatedAt) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/30">
                                        {brand.createdAt && (
                                            <div>
                                                <Label className="mb-2">Created At</Label>
                                                <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-mono">
                                                    {new Date(brand.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        )}
                                        {brand.updatedAt && (
                                            <div>
                                                <Label className="mb-2">Updated At</Label>
                                                <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-mono">
                                                    {new Date(brand.updatedAt).toLocaleString()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}

                <SheetFooter className="flex flex-row justify-end gap-3 border-t border-border/40 pt-4 sm:flex-row">
                    <Button variant="outline" size="lg" onClick={onClose}>
                        Close
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}