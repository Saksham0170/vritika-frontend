"use client"

import { useState, useEffect } from "react"
import { createOrderColumns } from "./components/columns"
import { DataTable } from "@/components/data-table"
import { getOrdersPaginated } from "@/services/order"
import { Order } from "@/types/order"
import { OrderDetailSheet } from "./components/order-detail-sheet"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderManagementPage() {
    const { toast } = useToast()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)

    const loadOrders = async (page: number = currentPage, limit: number = pageSize) => {
        try {
            setLoading(true)
            const response = await getOrdersPaginated({ page, limit })
            setOrders(response.data?.data || [])
            setTotalCount(response.data?.totalData || 0)
            setError(null)
        } catch (err: unknown) {
            console.error("Error loading orders:", err)
            const errorMessage = err instanceof Error ? err.message : "Unable to load order data"
            setError(errorMessage)
            toast({
                title: "Failed to Load Orders",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadOrders()
    }, [])

    const handlePageChange = (page: number, newPageSize: number) => {
        setCurrentPage(page)
        if (newPageSize !== pageSize) {
            setPageSize(newPageSize)
            // Reset to page 1 when page size changes
            loadOrders(1, newPageSize)
        } else {
            loadOrders(page, newPageSize)
        }
    }

    const handleRowClick = (order: Order) => {
        setSelectedOrderId(order._id)
    }

    const handleCloseSheet = () => {
        setSelectedOrderId(null)
    }

    const columns = createOrderColumns()

    if (error) {
        return (
            <div className="container mx-auto py-6">
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">Error Loading Orders</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <button
                            onClick={() => loadOrders()}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                        >
                            Retry
                        </button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-screen-xl mx-auto p-6 space-y-6">
            {/* Header Section */}
            <div className="pb-4 border-b border-border/40">
                <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
                <p className="text-muted-foreground mt-2">
                    Manage and view customer orders and their details. Click on any row to view detailed information.
                </p>
            </div>

            {/* Orders Table */}
            <div className="space-y-4">
                <DataTable
                    columns={columns}
                    data={orders}
                    loading={loading}
                    paginationMode="server"
                    totalCount={totalCount}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onRowClick={handleRowClick}
                    searchKey="customer.customerContactName"
                    searchPlaceholder="Search orders by customer name..."
                />
            </div>

            {/* Order Detail Sheet */}
            <OrderDetailSheet
                orderId={selectedOrderId}
                isOpen={!!selectedOrderId}
                onClose={handleCloseSheet}
            />
        </div>
    )
}