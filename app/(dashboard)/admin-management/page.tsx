"use client"

import { useState, useEffect } from "react"
import { createAdminColumns } from "./components/columns"
import { DataTable } from "@/components/data-table"
import { deleteAdmin, getAdminsPaginated } from "@/services/admin"
import { Admin } from "@/types/admin"
import { AdminDetailDialog } from "./components/admin-detail-dialog"
import { AdminEditDialog } from "./components/admin-edit-dialog"
import { AdminAddDialog } from "./components/admin-add-dialog"
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

export default function AdminManagementPage() {
  const { toast } = useToast()
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null)
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null)
  const [isAddingAdmin, setIsAddingAdmin] = useState(false)
  const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  const loadAdmins = async (page: number = currentPage, limit: number = pageSize) => {
    try {
      setLoading(true)
      const response = await getAdminsPaginated({ page, limit })
      setAdmins(response.data?.data || [])
      setTotalCount(response.data?.totalData || 0)
      setError(null)
    } catch (err: unknown) {
      console.error("Error loading admins:", err)
      const errorMessage = err instanceof Error ? err.message : "Unable to load admin data"
      setError(errorMessage)
      toast({
        title: "Failed to Load Admins",
        description: "Unable to fetch admin data. Please check your connection and try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdmins()
  }, [])

  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page)
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize)
      // Reset to page 1 when page size changes
      loadAdmins(1, newPageSize)
    } else {
      loadAdmins(page, newPageSize)
    }
  }

  const handleAddAdmin = () => {
    setIsAddingAdmin(true)
  }

  const handleRowClick = (admin: Admin) => {
    setSelectedAdminId(admin._id)
  }

  const handleEdit = (admin: Admin) => {
    setEditingAdminId(admin._id)
  }

  const handleDelete = (admin: Admin) => {
    setDeletingAdmin(admin)
  }

  const confirmDelete = async () => {
    if (!deletingAdmin) return

    setIsDeleting(true)
    try {
      await deleteAdmin(deletingAdmin._id)
      setAdmins((prev) => prev.filter((a) => a._id !== deletingAdmin._id))
      setDeletingAdmin(null)
      toast({
        title: "Admin Deleted",
        description: "The admin has been successfully removed from the system.",
        variant: "success"
      })
    } catch (error: unknown) {
      console.error("Error deleting admin:", error)
      toast({
        title: "Failed to Delete Admin",
        description: error instanceof Error ? error.message : 'Something went wrong while deleting the admin. Please try again.',
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditSuccess = () => {
    // Reload admins after successful edit
    loadAdmins()
  }

  const handleAddSuccess = () => {
    // Reload admins after successful add
    loadAdmins()
  }

  const adminColumns = createAdminColumns({
    onEdit: handleEdit,
    onDelete: handleDelete
  })

  return (
    <>
      <DataTable
        columns={adminColumns}
        data={admins}
        searchKey="name"
        searchPlaceholder="Search admins..."
        onAdd={handleAddAdmin}
        addButtonText="Add Admin"
        loading={loading}
        error={error}
        onRowClick={handleRowClick}
        paginationMode="server"
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />

      <AdminDetailDialog
        adminId={selectedAdminId}
        open={!!selectedAdminId}
        onClose={() => setSelectedAdminId(null)}
      />

      <AdminEditDialog
        adminId={editingAdminId}
        open={!!editingAdminId}
        onClose={() => setEditingAdminId(null)}
        onSuccess={handleEditSuccess}
      />

      <AdminAddDialog
        open={isAddingAdmin}
        onClose={() => setIsAddingAdmin(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingAdmin} onOpenChange={(open: boolean) => !open && setDeletingAdmin(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Admin</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingAdmin?.name}"? This action cannot be undone and will permanently remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingAdmin(null)}
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