"use client"

import { useState, useEffect } from "react"
import { createSubAdminColumns } from "./components/columns"
import { DataTable } from "@/components/data-table"
import { deleteSubAdmin, getSubAdminsPaginated } from "@/services/sub-admin"
import { SubAdmin } from "@/types/sub-admin"
import { SubAdminDetailDialog } from "./components/sub-admin-detail-dialog"
import { SubAdminEditDialog } from "./components/sub-admin-edit-dialog"
import { SubAdminAddDialog } from "./components/sub-admin-add-dialog"
import { useToast } from "@/hooks/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function SubAdminManagementPage() {
    const { toast } = useToast()
    const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedSubAdminId, setSelectedSubAdminId] = useState<string | null>(null)
    const [editingSubAdminId, setEditingSubAdminId] = useState<string | null>(null)
    const [isAddingSubAdmin, setIsAddingSubAdmin] = useState(false)
    const [deletingSubAdmin, setDeletingSubAdmin] = useState<SubAdmin | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)

    const loadSubAdmins = async (page: number = currentPage, limit: number = pageSize) => {
        try {
            setLoading(true)
            const response = await getSubAdminsPaginated({ page, limit })
            setSubAdmins(response.data?.data || [])
            setTotalCount(response.data?.totalData || 0)
            setError(null)
        } catch (err: unknown) {
            console.error("Error loading sub admins:", err)
            const errorMessage = err instanceof Error ? err.message : "Unable to load sub admin data"
            setError(errorMessage)
            toast({
                title: "Failed to Load Sub Admins",
                description: "Unable to fetch sub admin data. Please check your connection and try again.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSubAdmins()
    }, [])

    const handlePageChange = (page: number, newPageSize: number) => {
        setCurrentPage(page)
        if (newPageSize !== pageSize) {
            setPageSize(newPageSize)
            // Reset to page 1 when page size changes
            loadSubAdmins(1, newPageSize)
        } else {
            loadSubAdmins(page, newPageSize)
        }
    }

    const handleAddSubAdmin = () => {
        setIsAddingSubAdmin(true)
    }

    const handleRowClick = (subAdmin: SubAdmin) => {
        setSelectedSubAdminId(subAdmin._id)
    }

    const handleEdit = (subAdmin: SubAdmin) => {
        setEditingSubAdminId(subAdmin._id)
    }

    const handleDelete = (subAdmin: SubAdmin) => {
        setDeletingSubAdmin(subAdmin)
    }

    const confirmDelete = async () => {
        if (!deletingSubAdmin) return

        setIsDeleting(true)
        try {
            await deleteSubAdmin(deletingSubAdmin._id)
            setSubAdmins((prev) => prev.filter((sa) => sa._id !== deletingSubAdmin._id))
            setDeletingSubAdmin(null)
            toast({
                title: "Sub Admin Deleted",
                description: "The sub admin has been successfully removed from the system.",
                variant: "success"
            })
        } catch (error: unknown) {
            console.error("Error deleting sub admin:", error)
            toast({
                title: "Failed to Delete Sub Admin",
                description: error instanceof Error ? error.message : 'Something went wrong while deleting the sub admin. Please try again.',
                variant: "destructive"
            })
        } finally {
            setIsDeleting(false)
        }
    }

    const handleEditSuccess = () => {
        // Reload sub admins after successful edit
        loadSubAdmins()
    }

    const handleAddSuccess = () => {
        // Reload sub admins after successful add
        loadSubAdmins()
    }

    const subAdminColumns = createSubAdminColumns({
        onEdit: handleEdit,
        onDelete: handleDelete
    })

    return (
        <>
            <DataTable
                columns={subAdminColumns}
                data={subAdmins}
                searchKey="name"
                searchPlaceholder="Search sub admins..."
                onAdd={handleAddSubAdmin}
                addButtonText="Add Sub Admin"
                loading={loading}
                error={error}
                onRowClick={handleRowClick}
                paginationMode="server"
                totalCount={totalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
            />

            <SubAdminDetailDialog
                subAdminId={selectedSubAdminId}
                open={!!selectedSubAdminId}
                onClose={() => setSelectedSubAdminId(null)}
            />

            <SubAdminEditDialog
                subAdminId={editingSubAdminId}
                open={!!editingSubAdminId}
                onClose={() => setEditingSubAdminId(null)}
                onSuccess={handleEditSuccess}
            />

            <SubAdminAddDialog
                open={isAddingSubAdmin}
                onClose={() => setIsAddingSubAdmin(false)}
                onSuccess={handleAddSuccess}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deletingSubAdmin} onOpenChange={(open) => !open && setDeletingSubAdmin(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Sub Admin</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{deletingSubAdmin?.name}"? This action cannot be undone and will permanently remove all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingSubAdmin(null)}
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