"use client"

import { useState, useEffect } from "react"
import { Order } from "@/types/order"
import { getOrderById } from "@/services/order"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Phone, Mail, Calendar, Package, Zap, X } from "lucide-react"

interface OrderDetailDialogProps {
    orderId: string | null
    isOpen: boolean
    onClose: () => void
}

export function OrderDetailDialog({ orderId, isOpen, onClose }: OrderDetailDialogProps) {
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return

            setLoading(true)
            try {
                const response = await getOrderById(orderId)
                setOrder(response.data)
            } catch (error) {
                console.error("Error fetching order:", error)
            } finally {
                setLoading(false)
            }
        }

        if (isOpen && orderId) {
            fetchOrder()
        }
    }, [orderId, isOpen])

    const handleClose = () => {
        setOrder(null)
        onClose()
    }

    const calculateTotalPrice = () => {
        if (!order?.data) return 0
        return order.data.reduce((total, product) => {
            return total + (parseFloat(product.sellinPrice) * product.quantity)
        }, 0)
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Order Details
                        {order && (
                            <Badge variant="outline" className="ml-2">
                                #{order._id.slice(-8)}
                            </Badge>
                        )}
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                ) : order ? (
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <Badge
                                        variant={order.status === "created" ? "default" : "secondary"}
                                        className={order.status === "created" ? "bg-green-100 text-green-800" : ""}
                                    >
                                        {order.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">System Type</p>
                                    <p className="font-medium">{order.sytemType}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                                    <p className="font-medium">₹{calculateTotalPrice().toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Created Date</p>
                                    <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Products Count</p>
                                    <p className="font-medium">{order.data.length}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="h-5 w-5" />
                                    Customer Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                                        <p className="font-medium">{order.customer.title} {order.customer.customerContactName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Lead ID</p>
                                        <p className="font-medium">{order.customer.leadId}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                            <p className="font-medium">{order.customer.customerPhoneNo}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                                            <p className="font-medium">{order.customer.emailId}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                                        <p className="font-medium">
                                            {order.customer.customerAddress}, {order.customer.district}, {order.customer.state} - {order.customer.pinCode}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Site Survey Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5" />
                                    Site Survey Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Solar Capacity</p>
                                        <p className="font-medium">{order.sitesurveys.solarCapacity} KW</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Roof Surface Type</p>
                                        <p className="font-medium">{order.sitesurveys.roofSurfaceType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Total Roofs</p>
                                        <p className="font-medium">{order.sitesurveys.totalRoofs}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Dimensions</p>
                                        <p className="font-medium">{order.sitesurveys.length} x {order.sitesurveys.width} ft</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Roof Accessibility</p>
                                        <p className="font-medium">{order.sitesurveys.roofAccessibility}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Load KW</p>
                                        <p className="font-medium">{order.sitesurveys.sensationLoadKW} KW</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Products */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Products</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.data.map((product, index) => (
                                        <div key={product._id} className="border rounded-lg p-4">
                                            <div className="flex items-start gap-4">
                                                <img
                                                    src={product.image}
                                                    alt={product.productName}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div>
                                                        <p className="font-medium">{product.productName}</p>
                                                        <p className="text-sm text-muted-foreground">{product.type}</p>
                                                        {product.spvCapacity && (
                                                            <p className="text-sm text-muted-foreground">Capacity: {product.spvCapacity}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-muted-foreground">Category</p>
                                                        <Badge variant="outline">{product.category}</Badge>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                                                        <p className="font-medium">{product.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-muted-foreground">Price</p>
                                                        <p className="font-medium">₹{parseFloat(product.sellinPrice).toLocaleString()}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Total: ₹{(parseFloat(product.sellinPrice) * product.quantity).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            {index < order.data.length - 1 && <Separator className="mt-4" />}
                                        </div>
                                    ))}
                                </div>
                                <Separator className="my-4" />
                                <div className="flex justify-end">
                                    <div className="text-right">
                                        <p className="text-lg font-semibold">
                                            Total Amount: ₹{calculateTotalPrice().toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Close Button */}
                        <div className="flex justify-end pt-4 border-t">
                            <Button onClick={handleClose} variant="outline" className="flex items-center gap-2">
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
            </DialogContent>
        </Dialog>
    )
}