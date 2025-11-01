"use client"

import { useState, useEffect } from "react"
import { createCouponColumns } from "./components/columns"
import { DataTable } from "@/components/data-table"
import { deleteCoupon, getCoupons } from "@/services/coupon"
import { Coupon } from "@/types/coupon"
import { CouponDetailDialog } from "./components/coupon-detail-dialog"
import { CouponEditDialog } from "./components/coupon-edit-dialog"
import { CouponAddDialog } from "./components/coupon-add-dialog"
import { CouponSalespersonDialog } from "./components/coupon-salesperson-dialog"
import { useToast } from "@/hooks/use-toast"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function CouponManagementPage() {
    const { toast } = useToast()
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null)
    const [editingCouponId, setEditingCouponId] = useState<string | null>(null)
    const [isAddingCoupon, setIsAddingCoupon] = useState(false)
    const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [managingSalespersonCouponId, setManagingSalespersonCouponId] = useState<string | null>(null)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)

    const loadCoupons = async (page = currentPage, limit = pageSize) => {
        try {
            setLoading(true)
            const response = await getCoupons(page, limit)
            setCoupons(response.data?.data || [])
            setTotalCount(response.data?.totalData || 0)
            setCurrentPage(response.data?.page || 1)
            setError(null)
        } catch (err: unknown) {
            console.error("Error loading coupons:", err)
            const errorMessage = err instanceof Error ? err.message : "Failed to load coupons"
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCoupons()
    }, [])

    const handleAddCoupon = () => {
        setIsAddingCoupon(true)
    }

    const handleRowClick = (coupon: Coupon) => {
        setSelectedCouponId(coupon._id)
    }

    const handleEdit = (coupon: Coupon) => {
        setEditingCouponId(coupon._id)
    }

    const handleDelete = (coupon: Coupon) => {
        setDeletingCoupon(coupon)
    }

    const handleManageSalespeople = (coupon: Coupon) => {
        setManagingSalespersonCouponId(coupon._id)
    }

    const confirmDelete = async () => {
        if (!deletingCoupon) return

        setIsDeleting(true)
        try {
            await deleteCoupon(deletingCoupon._id)
            setDeletingCoupon(null)

            // Check if this was the last item on the current page and we're not on page 1
            const remainingItemsOnPage = coupons.length - 1
            if (remainingItemsOnPage === 0 && currentPage > 1) {
                // Go to the previous page
                setCurrentPage(currentPage - 1)
                loadCoupons(currentPage - 1, pageSize)
            } else {
                // Reload current page
                loadCoupons(currentPage, pageSize)
            }

            toast({
                title: "Success",
                description: "Coupon deleted successfully",
                variant: "success"
            })
        } catch (error: unknown) {
            console.error("Error deleting coupon:", error)
            toast({
                title: "Error deleting coupon",
                description: error instanceof Error ? error.message : 'Unknown error',
                variant: "destructive"
            })
        } finally {
            setIsDeleting(false)
        }
    }

    const handlePageChange = (page: number, newPageSize: number) => {
        if (newPageSize !== pageSize) {
            setPageSize(newPageSize)
            setCurrentPage(1) // Reset to first page when page size changes
            loadCoupons(1, newPageSize)
        } else {
            setCurrentPage(page)
            loadCoupons(page, newPageSize)
        }
    }

    const handleEditSuccess = () => {
        // Reload coupons after successful edit - stay on current page
        loadCoupons(currentPage, pageSize)
    }

    const handleAddSuccess = () => {
        // Reload coupons after successful add - go to first page to see the new coupon
        setCurrentPage(1)
        loadCoupons(1, pageSize)
    }

    const handleSalespersonManagementSuccess = () => {
        // Reload coupons after successful salesperson management - stay on current page
        loadCoupons(currentPage, pageSize)
    }

    const couponColumns = createCouponColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onManageSalespeople: handleManageSalespeople
    })

    return (
        <>
            <DataTable
                columns={couponColumns}
                data={coupons}
                searchKey="couponCode"
                searchPlaceholder="Search coupons..."
                onAdd={handleAddCoupon}
                addButtonText="Add Coupon"
                loading={loading}
                error={error}
                onRowClick={handleRowClick}
                paginationMode="server"
                totalCount={totalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
            />

            <CouponDetailDialog
                couponId={selectedCouponId}
                open={!!selectedCouponId}
                onClose={() => setSelectedCouponId(null)}
            />

            <CouponEditDialog
                couponId={editingCouponId}
                open={!!editingCouponId}
                onClose={() => setEditingCouponId(null)}
                onSuccess={handleEditSuccess}
            />

            <CouponAddDialog
                open={isAddingCoupon}
                onClose={() => setIsAddingCoupon(false)}
                onSuccess={handleAddSuccess}
            />

            <CouponSalespersonDialog
                couponId={managingSalespersonCouponId}
                open={!!managingSalespersonCouponId}
                onClose={() => setManagingSalespersonCouponId(null)}
                onSuccess={handleSalespersonManagementSuccess}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deletingCoupon} onOpenChange={(open) => !open && setDeletingCoupon(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Are you sure you want to delete the coupon &ldquo;{deletingCoupon?.couponCode}&rdquo;?</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            This action cannot be undone.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingCoupon(null)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
