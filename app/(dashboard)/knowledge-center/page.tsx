"use client"

import { useState, useEffect } from "react"
import { createKnowledgeCenterColumns } from "./components/columns"
import { DataTable } from "@/components/data-table"
import { deleteKnowledgeCenter, getKnowledgeCenterPaginated } from "@/services/knowledge-center"
import { KnowledgeCenterEntry } from "@/types/knowledge-center"
import { KnowledgeCenterAddDialog } from "./components/knowledge-center-add-dialog"
import { KnowledgeCenterEditDialog } from "./components/knowledge-center-edit-dialog"
import { useToast } from "@/hooks/use-toast"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function KnowledgeCenterPage() {
    const { toast } = useToast()
    const [entries, setEntries] = useState<KnowledgeCenterEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [editingEntry, setEditingEntry] = useState<KnowledgeCenterEntry | null>(null)
    const [isAddingEntry, setIsAddingEntry] = useState(false)
    const [deletingEntry, setDeletingEntry] = useState<KnowledgeCenterEntry | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)

    const loadEntries = async (page: number = currentPage, limit: number = pageSize) => {
        try {
            setLoading(true)
            const response = await getKnowledgeCenterPaginated({
                page,
                limit,
            })
            setEntries(response.data?.data || [])
            setTotalCount(response.data?.totalData || 0)
            setError(null)
        } catch (err: unknown) {
            console.error("Error loading knowledge center entries:", err)
            const errorMessage = err instanceof Error ? err.message : "Failed to load knowledge center entries"
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadEntries()
    }, [])

    const handlePageChange = (page: number, newPageSize: number) => {
        setCurrentPage(page)
        if (newPageSize !== pageSize) {
            setPageSize(newPageSize)
            // Reset to page 1 when page size changes
            loadEntries(1, newPageSize)
        } else {
            loadEntries(page, newPageSize)
        }
    }

    const handleAddEntry = () => {
        setIsAddingEntry(true)
    }

    const handleEditEntry = (entry: KnowledgeCenterEntry) => {
        setEditingEntry(entry)
    }

    const handleDeleteEntry = (entry: KnowledgeCenterEntry) => {
        setDeletingEntry(entry)
    }

    const confirmDelete = async () => {
        if (!deletingEntry) return

        try {
            setIsDeleting(true)
            await deleteKnowledgeCenter(deletingEntry._id)
            toast({
                title: "Success",
                description: "Knowledge center entry deleted successfully",
            })
            loadEntries()
            setDeletingEntry(null)
        } catch (error) {
            console.error("Error deleting knowledge center entry:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete knowledge center entry",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    const handleCloseAddDialog = () => {
        setIsAddingEntry(false)
    }

    const handleCloseEditDialog = () => {
        setEditingEntry(null)
    }

    const handleCloseDeleteDialog = () => {
        if (!isDeleting) {
            setDeletingEntry(null)
        }
    }

    const handleSuccess = () => {
        loadEntries()
    }

    const columns = createKnowledgeCenterColumns({
        onEdit: handleEditEntry,
        onDelete: handleDeleteEntry,
    })

    return (
        <div>

            {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                    <p className="font-medium">Error loading knowledge center entries</p>
                    <p className="text-sm mt-1">{error}</p>
                    <Button
                        onClick={() => loadEntries()}
                        variant="outline"
                        className="mt-3"
                    >
                        Try Again
                    </Button>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={entries}
                    loading={loading}
                    onAdd={handleAddEntry}
                    addButtonText="Add Entry"
                    paginationMode="server"
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalCount={totalCount}
                    onPageChange={handlePageChange}
                />
            )}

            <KnowledgeCenterAddDialog
                open={isAddingEntry}
                onClose={handleCloseAddDialog}
                onSuccess={handleSuccess}
            />

            <KnowledgeCenterEditDialog
                open={!!editingEntry}
                onClose={handleCloseEditDialog}
                onSuccess={handleSuccess}
                entry={editingEntry}
            />

            <Dialog open={!!deletingEntry} onOpenChange={handleCloseDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Knowledge Center Entry</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Are you sure you want to delete this entry?</p>
                        {deletingEntry && (
                            <div className="mt-4 rounded-lg bg-muted p-3 space-y-1">
                                <p className="text-sm">
                                    <span className="font-medium">Type:</span> {deletingEntry.type}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">URL:</span>{" "}
                                    <span className="text-muted-foreground truncate block">
                                        {deletingEntry.url}
                                    </span>
                                </p>
                            </div>
                        )}
                        <p className="text-sm text-muted-foreground mt-4">
                            This action cannot be undone.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={handleCloseDeleteDialog}
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
        </div>
    )
}
