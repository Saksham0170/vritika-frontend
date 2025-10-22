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
import { getProductById } from "@/services/product"
import { Product } from "@/types/product"

interface ProductDetailDialogProps {
    productId: string | null
    open: boolean
    onClose: () => void
}

export function ProductDetailDialog({ productId, open, onClose }: ProductDetailDialogProps) {
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (productId && open) {
            setLoading(true)
            setError(null)
            getProductById(productId)
                .then(setProduct)
                .catch((err: unknown) => {
                    const errorMessage = err instanceof Error ? err.message : "Failed to load product details"
                    setError(errorMessage)
                })
                .finally(() => setLoading(false))
        }
    }, [productId, open])

    const getTypeVariant = (type: string) => {
        switch (type) {
            case "Solar Module":
                return "default"
            case "Inverter":
                return "secondary"
            case "BOS":
                return "outline"
            case "Kit":
                return "destructive"
            case "Structure":
                return "outline"
            default:
                return "secondary"
        }
    }

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="right" className="w-[80vw] sm:w-[70vw] lg:w-[50vw] xl:w-[40vw] max-w-2xl overflow-y-auto rounded-2xl border border-border/40 bg-zinc-100 dark:bg-background text-foreground shadow-lg">
                <SheetHeader className="bg-zinc-100/70 dark:bg-background/70 backdrop-blur-md border-b border-border/40">
                    <SheetTitle className="text-xl font-semibold py-0">Product Details</SheetTitle>
                </SheetHeader>

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <LoadingSpinner message="Loading product details..." />
                    </div>
                )}

                {error && (
                    <div className="text-red-600 text-center py-8 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800 mx-6">
                        {error}
                    </div>
                )}

                {product && !loading && !error && (
                    <div className="py-4 px-6">
                        {/* ---------- Product Information ---------- */}
                        <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                            <div className="space-y-6">
                                {/* Basic Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="mb-2">Product Name</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-medium">
                                            {product.productName}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="mb-2">Type</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                            <Badge variant={getTypeVariant(product.type)}>{product.type}</Badge>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="mb-2">Price</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-medium text-green-600">
                                            ₹{product.price.toLocaleString()}
                                        </div>
                                    </div>

                                    {product.sellinPrice && (
                                        <div>
                                            <Label className="mb-2">Selling Price</Label>
                                            <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-medium text-blue-600">
                                                ₹{product.sellinPrice.toLocaleString()}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Product Image */}
                                {product.image && (
                                    <div>
                                        <Label className="mb-2">Product Image</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30">
                                            <img
                                                src={product.image}
                                                alt={product.productName}
                                                className="w-32 h-32 object-cover rounded-lg border border-border"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement
                                                    target.style.display = 'none'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Additional Specifications */}
                                {(product.spvBrand || product.spvType || product.phase || product.capacity || product.spvCapacity || product.category || product.height || product.width || product.weight || product.thickness || product.unit || product.free || product.description) && (
                                    <div className="pt-4 border-t border-border/30">
                                        <h3 className="text-lg font-semibold mb-4">Additional Specifications</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {product.spvBrand && (
                                                <div>
                                                    <Label className="mb-2">SPV Brand</Label>
                                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                        {product.spvBrand}
                                                    </div>
                                                </div>
                                            )}

                                            {product.spvType && (
                                                <div>
                                                    <Label className="mb-2">SPV Type</Label>
                                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                        {product.spvType}
                                                    </div>
                                                </div>
                                            )}

                                            {product.category && (
                                                <div>
                                                    <Label className="mb-2">Category</Label>
                                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                        <Badge variant="outline" className="bg-background/50">
                                                            {product.category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )}

                                            {product.phase && (
                                                <div>
                                                    <Label className="mb-2">Phase</Label>
                                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                        {product.phase}
                                                    </div>
                                                </div>
                                            )}

                                            {product.capacity && (
                                                <div>
                                                    <Label className="mb-2">Capacity</Label>
                                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                        {product.capacity}
                                                    </div>
                                                </div>
                                            )}

                                            {product.spvCapacity && (
                                                <div>
                                                    <Label className="mb-2">SPV Capacity</Label>
                                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                        {product.spvCapacity}
                                                    </div>
                                                </div>
                                            )}

                                            {product.height && (
                                                <div>
                                                    <Label className="mb-2">Height</Label>
                                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                        {product.height}
                                                    </div>
                                                </div>
                                            )}

                                            {product.width && (
                                                <div>
                                                    <Label className="mb-2">Width</Label>
                                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                        {product.width}
                                                    </div>
                                                </div>
                                            )}

                                            {product.weight && (
                                                <div>
                                                    <Label className="mb-2">Weight</Label>
                                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                        {product.weight}
                                                    </div>
                                                </div>
                                            )}

                                            {product.elevateStructure && (
                                                <div>
                                                    <Label className="mb-2">Elevate Structure</Label>
                                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                        {product.elevateStructure}
                                                    </div>
                                                </div>
                                            )}

                                            {product.unit && (
                                                <div>
                                                    <Label className="mb-2">Unit</Label>
                                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                        {product.unit}
                                                    </div>
                                                </div>
                                            )}

                                            {product.free && (
                                                <div>
                                                    <Label className="mb-2">Free</Label>
                                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                        {product.free}
                                                    </div>
                                                </div>
                                            )}

                                            {product.thickness && (
                                                <div>
                                                    <Label className="mb-2">Thickness</Label>
                                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                        {product.thickness}
                                                    </div>
                                                </div>
                                            )}

                                            {product.description && (
                                                <div className="md:col-span-2">
                                                    <Label className="mb-2">Description</Label>
                                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm min-h-[80px]">
                                                        {product.description}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Timestamps */}
                                {(product.createdAt || product.updatedAt) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/30">
                                        {product.createdAt && (
                                            <div>
                                                <Label className="mb-2">Created At</Label>
                                                <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-mono">
                                                    {new Date(product.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        )}
                                        {product.updatedAt && (
                                            <div>
                                                <Label className="mb-2">Updated At</Label>
                                                <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-mono">
                                                    {new Date(product.updatedAt).toLocaleString()}
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