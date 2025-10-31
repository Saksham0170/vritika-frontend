"use client"

import { useEffect, useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Order } from "@/types/order"
import { getOrderById } from "@/services/order"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarDays, MapPin, Phone, Mail, User, Package, Zap, X } from "lucide-react"

interface OrderDetailSheetProps {
    orderId: string | null
    isOpen: boolean
    onClose: () => void
}

export function OrderDetailSheet({ orderId, isOpen, onClose }: OrderDetailSheetProps) {
    const { toast } = useToast()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (orderId && isOpen) {
            fetchOrderDetails(orderId)
        }
    }, [orderId, isOpen])

    const fetchOrderDetails = async (id: string) => {
        try {
            setLoading(true)
            const response = await getOrderById(id)
            if (response.status && response.data) {
                setOrder(response.data)
            } else {
                throw new Error("Failed to fetch order details")
            }
        } catch (err: unknown) {
            console.error("Error fetching order details:", err)
            const errorMessage = err instanceof Error ? err.message : "Unable to fetch order details"
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const calculateTotalAmount = (products: any[]) => {
        return products.reduce((sum, product) => {
            return sum + (parseFloat(product.sellinPrice) * product.quantity)
        }, 0)
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-[700px] sm:w-[900px] overflow-y-auto">
                <SheetHeader className="pb-6 border-b">
                    <SheetTitle className="text-xl">Order Details</SheetTitle>
                </SheetHeader>

                {loading ? (
                    <div className="space-y-6 mt-8">
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-1/4" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-1/4" />
                            <Skeleton className="h-40 w-full" />
                        </div>
                    </div>
                ) : order ? (
                    <div className="space-y-8 mt-8 px-5">
                        {/* Order Overview */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Package className="h-5 w-5 text-primary" />
                                    </div>
                                    Order Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                                        <p className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block break-all">
                                            {order._id}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                                        <Badge
                                            variant={order.status === "created" ? "default" : "secondary"}
                                            className="capitalize"
                                        >
                                            {order.status}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">System Type</p>
                                        <Badge variant="outline" className="capitalize">
                                            {order.sytemType}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Created At</p>
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{formatDate(order.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Customer Information */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                    Customer Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                                        <p className="font-semibold text-base">{order.customer.customerContactName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Lead ID</p>
                                        <p className="font-mono text-sm">{order.customer.leadId}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{order.customer.customerPhoneNo}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{order.customer.emailId}</span>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                                        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                            <div className="space-y-1">
                                                <p className="text-sm">{order.customer.customerAddress}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {order.customer.district}, {order.customer.state} - {order.customer.pinCode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Site Survey Information */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                        <Zap className="h-5 w-5 text-green-600" />
                                    </div>
                                    Site Survey Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Survey ID</p>
                                        <p className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block break-all">
                                            {order.sitesurveys._id}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Dimensions</p>
                                        <p className="text-sm font-semibold">
                                            {order.sitesurveys.length}m × {order.sitesurveys.width}m
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Solar Capacity</p>
                                        <p className="text-sm font-semibold">{order.sitesurveys.solarCapacity} KW</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Roof Surface</p>
                                        <Badge variant="secondary">{order.sitesurveys.roofSurfaceType}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Total Roofs</p>
                                        <p className="text-sm font-semibold">{order.sitesurveys.totalRoofs}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Accessibility</p>
                                        <Badge
                                            variant={order.sitesurveys.roofAccessibility === "Safe" ? "default" : "destructive"}
                                            className="capitalize"
                                        >
                                            {order.sitesurveys.roofAccessibility}
                                        </Badge>
                                    </div>
                                </div>

                                {(order.sitesurveys.acPremises || order.sitesurveys.carsOwned || order.sitesurveys.gridInverters) && (
                                    <Separator className="my-4" />
                                )}

                                {(order.sitesurveys.acPremises || order.sitesurveys.carsOwned || order.sitesurveys.gridInverters) && (
                                    <div>
                                        <h4 className="font-medium text-sm mb-3 text-muted-foreground">Additional Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {order.sitesurveys.acPremises && (
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-muted-foreground">AC Premises</p>
                                                    <p className="text-sm">{order.sitesurveys.acPremises}</p>
                                                </div>
                                            )}
                                            {order.sitesurveys.carsOwned && (
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-muted-foreground">Cars Owned</p>
                                                    <p className="text-sm">{order.sitesurveys.carsOwned}</p>
                                                </div>
                                            )}
                                            {order.sitesurveys.gridInverters && (
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-muted-foreground">Grid Inverters</p>
                                                    <Badge variant={order.sitesurveys.gridInverters === "yes" ? "default" : "secondary"} className="text-xs">
                                                        {order.sitesurveys.gridInverters}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Product Details */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <Package className="h-5 w-5 text-purple-600" />
                                    </div>
                                    Products ({order.data.length})
                                    <Badge variant="outline" className="ml-auto">
                                        Total: ₹{calculateTotalAmount(order.data).toFixed(2)}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    Complete list of products included in this order
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.data.map((product, index) => (
                                        <Card key={product._id} className="bg-muted/30 border-dashed">
                                            <CardContent className="pt-4">
                                                <div className="flex items-start gap-4 mb-4">
                                                    <img
                                                        src={product.image}
                                                        alt={product.productName}
                                                        className="w-16 h-16 object-cover rounded-lg border"
                                                    />
                                                    <div className="flex-1 flex justify-between">
                                                        <div>
                                                            <h4 className="font-semibold">{product.productName}</h4>
                                                            <p className="text-xs text-muted-foreground font-mono break-all">ID: {product._id}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold">₹{product.sellinPrice}</p>
                                                            <p className="text-xs text-muted-foreground">Qty: {product.quantity}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium text-muted-foreground">Type</p>
                                                        <Badge variant="outline" className="text-xs">{product.type}</Badge>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium text-muted-foreground">Category</p>
                                                        <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium text-muted-foreground">Base Price</p>
                                                        <p className="text-sm">₹{product.price}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium text-muted-foreground">Subtotal</p>
                                                        <p className="text-sm font-medium">
                                                            ₹{(parseFloat(product.sellinPrice) * product.quantity).toFixed(2)}
                                                        </p>
                                                    </div>

                                                    {/* Product specific fields */}
                                                    {product.spvCapacity && (
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">SPV Capacity</p>
                                                            <p>{product.spvCapacity}</p>
                                                        </div>
                                                    )}
                                                    {product.width && (
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">Width</p>
                                                            <p>{product.width}</p>
                                                        </div>
                                                    )}
                                                    {product.height && (
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">Height</p>
                                                            <p>{product.height}</p>
                                                        </div>
                                                    )}
                                                    {product.weight && (
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">Weight</p>
                                                            <p>{product.weight}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    <Separator />

                                    <div className="flex justify-between items-center text-lg font-semibold">
                                        <span>Total Amount:</span>
                                        <span>₹{calculateTotalAmount(order.data).toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Close Button */}
                        <div className="flex justify-end pt-6 pb-4 border-t mt-6">
                            <Button onClick={onClose} variant="outline" className="flex items-center gap-2">
                                <X className="h-4 w-4" />
                                Close
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Order not found</p>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}