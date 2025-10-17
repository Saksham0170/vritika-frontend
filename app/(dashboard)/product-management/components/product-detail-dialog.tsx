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
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/40 bg-background text-foreground shadow-lg">
                <DialogHeader className="bg-background/70 backdrop-blur-md border-b border-border/40">
                    <DialogTitle className="text-xl font-semibold py-0">Product Details</DialogTitle>
                </DialogHeader>

                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <LoadingSpinner />
                    </div>
                )}

                {error && (
                    <div className="text-center py-8">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}

                {product && !loading && !error && (
                    <div className="py-4">
                        <div className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Product Name</Label>
                                        <p className="text-lg font-semibold mt-1">{product.productName}</p>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                                        <div className="mt-1">
                                            <Badge variant={getTypeVariant(product.type)}>{product.type}</Badge>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Price</Label>
                                        <p className="text-lg font-semibold mt-1 text-green-600">₹{product.price.toLocaleString()}</p>
                                    </div>

                                    {product.image && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Image</Label>
                                            <div className="mt-2">
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
                                </div>

                                {/* Optional Fields */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b border-border pb-2">Additional Information</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {product.spvBrand && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">SPV Brand</Label>
                                                <p className="mt-1">{product.spvBrand}</p>
                                            </div>
                                        )}

                                        {product.spvType && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">SPV Type</Label>
                                                <p className="mt-1">{product.spvType}</p>
                                            </div>
                                        )}

                                        {product.phase && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Phase</Label>
                                                <p className="mt-1">{product.phase}</p>
                                            </div>
                                        )}

                                        {product.capacity && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Capacity</Label>
                                                <p className="mt-1">{product.capacity}</p>
                                            </div>
                                        )}

                                        {product.spvCapacity && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">SPV Capacity</Label>
                                                <p className="mt-1">{product.spvCapacity}</p>
                                            </div>
                                        )}

                                        {product.service && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Service</Label>
                                                <p className="mt-1">{product.service}</p>
                                            </div>
                                        )}

                                        {product.thickness && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Thickness</Label>
                                                <p className="mt-1">{product.thickness}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* System Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b border-border pb-2">System Information</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Product ID</Label>
                                            <p className="mt-1 font-mono text-sm">{product._id}</p>
                                        </div>

                                        {product.createdAt && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
                                                <p className="mt-1">{new Date(product.createdAt).toLocaleString()}</p>
                                            </div>
                                        )}

                                        {product.updatedAt && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Updated At</Label>
                                                <p className="mt-1">{new Date(product.updatedAt).toLocaleString()}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter className="border-t border-border/40 bg-background/70 backdrop-blur-md">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}