"use client"

import { useState, useEffect } from "react"
import { createRoleCommissionColumns } from "./components/columns"
import { DataTable } from "@/components/data-table"
import { deleteRoleCommission, getRoleCommissionsPaginated } from "@/services/role-commission"
import { RoleCommission } from "@/types/role-commission"
import { RoleCommissionDetailDialog } from "./components/role-commission-detail-dialog"
import { RoleCommissionEditDialog } from "./components/role-commission-edit-dialog"
import { RoleCommissionAddDialog } from "./components/role-commission-add-dialog"

export default function RoleCommissionPage() {
  const [roleCommissions, setRoleCommissions] = useState<RoleCommission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRoleCommissionId, setSelectedRoleCommissionId] = useState<string | null>(null)
  const [editingRoleCommissionId, setEditingRoleCommissionId] = useState<string | null>(null)
  const [isAddingRoleCommission, setIsAddingRoleCommission] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  const loadRoleCommissions = async (page: number = currentPage, limit: number = pageSize) => {
    try {
      setLoading(true)
      console.log('Loading role commissions...')
      const response = await getRoleCommissionsPaginated({ page, limit })
      console.log('Received role commission response in component:', response)
      setRoleCommissions(response.data?.data || [])
      setTotalCount(response.data?.pagination?.total || 0)
      setError(null)
    } catch (err: unknown) {
      console.error("Error loading role commissions:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load role commissions"
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
    setSelectedRoleCommissionId(roleCommission._id)
  }

  const handleEdit = (roleCommission: RoleCommission) => {
    setEditingRoleCommissionId(roleCommission._id)
  }

  const handleDelete = (roleCommission: RoleCommission) => {
    deleteRoleCommission(roleCommission._id)
      .then(() => {
        setRoleCommissions((prev) => prev.filter((rc) => rc._id !== roleCommission._id))
      })
  }

  const handleEditSuccess = () => {
    // Reload role commissions after successful edit
    loadRoleCommissions()
  }

  const handleAddSuccess = () => {
    // Reload role commissions after successful add
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
        title="Role Commission Management"
        description="Manage commission rates for different role levels"
        searchKey="description"
        searchPlaceholder="Search by description..."
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
        roleCommissionId={selectedRoleCommissionId}
        open={!!selectedRoleCommissionId}
        onClose={() => setSelectedRoleCommissionId(null)}
      />

      <RoleCommissionEditDialog
        roleCommissionId={editingRoleCommissionId}
        open={!!editingRoleCommissionId}
        onClose={() => setEditingRoleCommissionId(null)}
        onSuccess={handleEditSuccess}
      />

      <RoleCommissionAddDialog
        open={isAddingRoleCommission}
        onClose={() => setIsAddingRoleCommission(false)}
        onSuccess={handleAddSuccess}
      />
    </>
  )
}