"use client"

import { useState, useEffect } from "react"
import { createSubAdminColumns } from "./components/columns"
import { DataTable } from "@/components/data-table"
import { deleteSubAdmin, getSubAdminsPaginated } from "@/services/sub-admin"
import { SubAdmin } from "@/types/sub-admin"
import { SubAdminDetailDialog } from "./components/sub-admin-detail-dialog"
import { SubAdminEditDialog } from "./components/sub-admin-edit-dialog"
import { SubAdminAddDialog } from "./components/sub-admin-add-dialog"

export default function SubAdminManagementPage() {
    const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedSubAdminId, setSelectedSubAdminId] = useState<string | null>(null)
    const [editingSubAdminId, setEditingSubAdminId] = useState<string | null>(null)
    const [isAddingSubAdmin, setIsAddingSubAdmin] = useState(false)

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
            const errorMessage = err instanceof Error ? err.message : "Failed to load sub admins"
            setError(errorMessage)
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
        deleteSubAdmin(subAdmin._id)
            .then(() => {
                setSubAdmins((prev) => prev.filter((sa) => sa._id !== subAdmin._id))
            })
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
                title="Sub Admin Management"
                description="Manage and control all sub admin accounts efficiently"
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
        </>
    )
}