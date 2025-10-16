"use client"

import { useState, useEffect } from "react"
import { createAdminColumns } from "./components/columns"
import { DataTable } from "@/components/data-table"
import { deleteAdmin, getAdmins } from "@/services/admin"
import { Admin } from "@/types/admin"
import { AdminDetailDialog } from "./components/admin-detail-dialog"
import { AdminEditDialog } from "./components/admin-edit-dialog"
import { AdminAddDialog } from "./components/admin-add-dialog"

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null)
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null)
  const [isAddingAdmin, setIsAddingAdmin] = useState(false)

  const loadAdmins = async () => {
    try {
      const adminData = await getAdmins()
      setAdmins(adminData)
      setError(null)
    } catch (err: unknown) {
      console.error("Error loading admins:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load admins"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdmins()
  }, [])

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
    deleteAdmin(admin._id)
      .then(() => {
        setAdmins((prev) => prev.filter((a) => a._id !== admin._id))
      })
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
        title="Admin Management"
        description="Manage and control all admin accounts efficiently"
        searchKey="name"
        searchPlaceholder="Search admins..."
        onAdd={handleAddAdmin}
        addButtonText="Add Admin"
        loading={loading}
        error={error}
        onRowClick={handleRowClick}
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
    </>
  )
}