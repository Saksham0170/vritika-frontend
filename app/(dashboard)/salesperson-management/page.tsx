"use client"

import { useState, useEffect } from "react"
import { createSalespersonColumns } from "./components/columns"
import { DataTable } from "@/components/data-table"
import { deleteSalesperson, getSalespersonsPaginated } from "@/services/salesperson"
import { Salesperson } from "@/types/salesperson"
import { SalespersonDetailDialog } from "./components/salesperson-detail-dialog"
import { SalespersonEditDialog } from "./components/salesperson-edit-dialog"
import { SalespersonAddDialog } from "./components/salesperson-add-dialog"
import { useToast } from "@/hooks/use-toast"

export default function SalespersonManagementPage() {
  const { toast } = useToast()
  const [salespersons, setSalespersons] = useState<Salesperson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSalespersonId, setSelectedSalespersonId] = useState<string | null>(null)
  const [editingSalespersonId, setEditingSalespersonId] = useState<string | null>(null)
  const [isAddingSalesperson, setIsAddingSalesperson] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  const loadSalespersons = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getSalespersonsPaginated({
        page: currentPage,
        limit: pageSize,
      })

      setSalespersons(response.data || [])
      // Note: API doesn't provide separate total count, using array length for now
      // For proper pagination, we might need total count from a separate endpoint or header
      setTotalCount(response.data.length || 0)
    } catch (error) {
      console.error("Error loading salespersons:", error)
      setError("Failed to load salespersons. Please try again.")
      setSalespersons([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSalespersons()
  }, [currentPage, pageSize])

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page)
    setPageSize(size)
  }

  const handleRowClick = (salesperson: Salesperson) => {
    setSelectedSalespersonId(salesperson._id)
  }

  const handleAddSalesperson = () => {
    setIsAddingSalesperson(true)
  }

  const handleEdit = (salesperson: Salesperson) => {
    setEditingSalespersonId(salesperson._id)
  }

  const handleDelete = async (salesperson: Salesperson) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete salesperson "${salesperson.name}"? This action cannot be undone.`
    )

    if (!confirmed) return

    try {
      await deleteSalesperson(salesperson._id)
      toast({
        title: "Success",
        description: "Salesperson deleted successfully",
        variant: "success"
      })
      await loadSalespersons() // Reload the list
    } catch (error) {
      console.error("Error deleting salesperson:", error)
      toast({
        title: "Error deleting salesperson",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      })
    }
  }

  const salespersonColumns = createSalespersonColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  const selectedSalesperson = salespersons.find(s => s._id === selectedSalespersonId)
  const editingSalesperson = salespersons.find(s => s._id === editingSalespersonId)

  return (
    <>
      <DataTable
        columns={salespersonColumns}
        data={salespersons}
        title="Salesperson Management"
        description="Manage salesperson accounts, view details, and handle permissions"
        searchKey="name"
        searchPlaceholder="Search salespersons by name, phone, or email..."
        onAdd={handleAddSalesperson}
        addButtonText="Add Salesperson"
        loading={loading}
        error={error}
        onRowClick={handleRowClick}
        paginationMode="server"
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />

      {/* Detail Dialog */}
      <SalespersonDetailDialog
        open={!!selectedSalespersonId}
        onClose={() => setSelectedSalespersonId(null)}
        salesperson={selectedSalesperson || null}
      />

      {/* Edit Dialog */}
      <SalespersonEditDialog
        open={!!editingSalespersonId}
        onClose={() => setEditingSalespersonId(null)}
        onSuccess={() => {
          setEditingSalespersonId(null)
          loadSalespersons()
        }}
        salesperson={editingSalesperson || null}
      />

      {/* Add Dialog */}
      <SalespersonAddDialog
        open={isAddingSalesperson}
        onClose={() => setIsAddingSalesperson(false)}
        onSuccess={() => {
          setIsAddingSalesperson(false)
          loadSalespersons()
        }}
      />
    </>
  )
}