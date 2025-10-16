"use client"

import { useState, useEffect } from "react"
import { createBrandColumns } from "./components/columns"
import { DataTable } from "@/components/data-table"
import { deleteBrand, getBrands } from "@/services/brand"
import { Brand } from "@/types/brand"
import { BrandDetailDialog } from "./components/brand-detail-dialog"
import { BrandEditDialog } from "./components/brand-edit-dialog"
import { BrandAddDialog } from "./components/brand-add-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"


export default function BrandManagementPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null)
  const [isAddingBrand, setIsAddingBrand] = useState(false)
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadBrands = async () => {
    try {
      const brandData = await getBrands()
      setBrands(brandData || [])
      setError(null)
    } catch (err: unknown) {
      console.error("Error loading brands:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load brands"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBrands()
  }, [])

  const handleAddBrand = () => {
    setIsAddingBrand(true)
  }

  const handleRowClick = (brand: Brand) => {
    setSelectedBrandId(brand._id)
  }

  const handleEdit = (brand: Brand) => {
    setEditingBrandId(brand._id)
  }

  const handleDelete = (brand: Brand) => {
    setDeletingBrand(brand)
  }

  const confirmDelete = async () => {
    if (!deletingBrand) return

    setIsDeleting(true)
    try {
      await deleteBrand(deletingBrand._id)
      setBrands((prev) => prev.filter((b) => b._id !== deletingBrand._id))
      setDeletingBrand(null)
    } catch (error: unknown) {
      console.error("Error deleting brand:", error)
      // Handle error silently
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditSuccess = () => {
    // Reload brands after successful edit
    loadBrands()
  }

  const handleAddSuccess = () => {
    // Reload brands after successful add
    loadBrands()
  }

  const brandColumns = createBrandColumns({
    onEdit: handleEdit,
    onDelete: handleDelete
  })

  return (
    <>
      <DataTable
        columns={brandColumns}
        data={brands}
        title="Brand Management"
        description="Full control over your brands and their details"
        searchKey="brandName"
        searchPlaceholder="Search brands..."
        onAdd={handleAddBrand}
        addButtonText="Add Brand"
        loading={loading}
        error={error}
        onRowClick={handleRowClick}
      />

      <BrandDetailDialog
        brandId={selectedBrandId}
        open={!!selectedBrandId}
        onClose={() => setSelectedBrandId(null)}
      />

      <BrandEditDialog
        brandId={editingBrandId}
        open={!!editingBrandId}
        onClose={() => setEditingBrandId(null)}
        onSuccess={handleEditSuccess}
      />

      <BrandAddDialog
        open={isAddingBrand}
        onClose={() => setIsAddingBrand(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingBrand} onOpenChange={(open) => !open && setDeletingBrand(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the brand &ldquo;{deletingBrand?.brandName}&rdquo;?</p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingBrand(null)}
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
