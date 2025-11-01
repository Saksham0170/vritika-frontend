"use client"

import { useState, useEffect } from "react"
import { createRoleCommissionColumns } from "./components/columns"
import { DataTable } from "@/components/data-table"
import { deleteRoleCommissionById, getRoleCommissionsPaginated } from "@/services/role-commission"
import { RoleCommission } from "@/types/role-commission"
import { RoleCommissionDetailDialog } from "./components/sub-admin-commission-detail-dialog"
import { RoleCommissionEditDialog } from "./components/sub-admin-commission-edit-dialog"
import { RoleCommissionAddDialog } from "./components/sub-admin-commission-add-dialog"
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

export default function RoleCommissionPage() {
  const { toast } = useToast()
  const [roleCommissions, setRoleCommissions] = useState<RoleCommission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubAdminId, setSelectedSubAdminId] = useState<string | null>(null)
  const [editingRoleCommission, setEditingRoleCommission] = useState<RoleCommission | null>(null)
  const [isAddingRoleCommission, setIsAddingRoleCommission] = useState(false)
  const [deletingRoleCommission, setDeletingRoleCommission] = useState<RoleCommission | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  const loadRoleCommissions = async (page: number = currentPage, limit: number = pageSize) => {
    try {
      setLoading(true)
      const response = await getRoleCommissionsPaginated({ page, limit, type: 'sub-admin' })
      setRoleCommissions(response.data?.data || [])
      setTotalCount(response.data?.pagination?.total || 0)
      setError(null)
    } catch (err: unknown) {
      console.error("Error loading sub-admin commissions:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load sub-admin commissions"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoleCommissions()
  }, [])

  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page)
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize)
      // Reset to page 1 when page size changes
      loadRoleCommissions(1, newPageSize)
    } else {
      loadRoleCommissions(page, newPageSize)
    }
  }

  const handleAddRoleCommission = () => {
    setIsAddingRoleCommission(true)
  }

  const handleRowClick = (roleCommission: RoleCommission) => {
    if (roleCommission.subAdminId?._id) {
      setSelectedSubAdminId(roleCommission.subAdminId._id)
    }
  }

  const handleEdit = (roleCommission: RoleCommission) => {
    setEditingRoleCommission(roleCommission)
  }

  const handleDelete = (roleCommission: RoleCommission) => {
    setDeletingRoleCommission(roleCommission)
  }

  const confirmDelete = async () => {
    if (!deletingRoleCommission?._id) return

    setIsDeleting(true)
    try {
      await deleteRoleCommissionById(deletingRoleCommission._id)
      setRoleCommissions((prev) => prev.filter((rc) => rc._id !== deletingRoleCommission._id))
      setDeletingRoleCommission(null)
      toast({
        title: "Success",
        description: "Sub-admin commission deleted successfully",
        variant: "success"
      })
    } catch (error: unknown) {
      console.error("Error deleting sub-admin commission:", error)
      toast({
        title: "Error deleting commission",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditSuccess = () => {
    // Reload sub-admin commissions after successful edit
    loadRoleCommissions()
  }

  const handleAddSuccess = () => {
    // Reload sub-admin commissions after successful add
    loadRoleCommissions()
  }

  const roleCommissionColumns = createRoleCommissionColumns({
    onEdit: handleEdit,
    onDelete: handleDelete
  })

  return (
    <>
      <DataTable
        columns={roleCommissionColumns}
        data={roleCommissions}
        searchKey="subadmin-name"
        searchPlaceholder="Search by sub-admin name..."
        onAdd={handleAddRoleCommission}
        addButtonText="Add Commission"
        loading={loading}
        error={error}
        onRowClick={handleRowClick}
        paginationMode="server"
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />

      <RoleCommissionDetailDialog
        subAdminId={selectedSubAdminId}
        open={!!selectedSubAdminId}
        onClose={() => setSelectedSubAdminId(null)}
      />

      <RoleCommissionEditDialog
        roleCommission={editingRoleCommission}
        open={!!editingRoleCommission}
        onClose={() => setEditingRoleCommission(null)}
        onSuccess={handleEditSuccess}
      />

      <RoleCommissionAddDialog
        open={isAddingRoleCommission}
        onClose={() => setIsAddingRoleCommission(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingRoleCommission} onOpenChange={(open) => !open && setDeletingRoleCommission(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sub-Admin Commission</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the sub-admin commission for &ldquo;{deletingRoleCommission?.subAdminId?.name}&rdquo;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingRoleCommission(null)}
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