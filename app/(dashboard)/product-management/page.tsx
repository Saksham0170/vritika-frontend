"use client"

import { useState, useEffect } from "react"
import { createProductColumns } from "./components/columns"
import { DataTable } from "@/components/data-table"
import { deleteProduct, getProductsPaginated } from "@/services/product"
import { Product } from "@/types/product"
import { ProductDetailDialog } from "./components/product-detail-dialog"
import { ProductEditDialog } from "./components/product-edit-dialog"
import { ProductAddDialog } from "./components/product-add-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  const loadProducts = async (page: number = currentPage, limit: number = pageSize) => {
    try {
      setLoading(true)
      const response = await getProductsPaginated({ page, limit })
      setProducts(response.data?.data || [])
      setTotalCount(response.data?.totalData || 0)
      setError(null)
    } catch (err: unknown) {
      console.error("Error loading products:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load products"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page)
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize)
      // Reset to page 1 when page size changes
      loadProducts(1, newPageSize)
    } else {
      loadProducts(page, newPageSize)
    }
  }

  const handleAddProduct = () => {
    setIsAddingProduct(true)
  }

  const handleRowClick = (product: Product) => {
    setSelectedProductId(product._id)
  }

  const handleEdit = (product: Product) => {
    setEditingProductId(product._id)
  }

  const handleDelete = (product: Product) => {
    setDeletingProduct(product)
  }

  const confirmDelete = async () => {
    if (!deletingProduct) return

    setIsDeleting(true)
    try {
      await deleteProduct(deletingProduct._id)
      setProducts((prev) => prev.filter((p) => p._id !== deletingProduct._id))
      setDeletingProduct(null)
    } catch (error: unknown) {
      console.error("Error deleting product:", error)
      // Handle error silently
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditSuccess = () => {
    // Reload products after successful edit
    loadProducts()
  }

  const handleAddSuccess = () => {
    // Reload products after successful add
    loadProducts()
  }

  const productColumns = createProductColumns({
    onEdit: handleEdit,
    onDelete: handleDelete
  })

  return (
    <>
      <DataTable
        columns={productColumns}
        data={products}
        title="Product Management"
        description="Full control over your products, inventory and pricing"
        searchKey="productName"
        searchPlaceholder="Search products..."
        onAdd={handleAddProduct}
        addButtonText="Add Product"
        loading={loading}
        error={error}
        onRowClick={handleRowClick}
        paginationMode="server"
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />

      <ProductDetailDialog
        productId={selectedProductId}
        open={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />

      <ProductEditDialog
        productId={editingProductId}
        open={!!editingProductId}
        onClose={() => setEditingProductId(null)}
        onSuccess={handleEditSuccess}
      />

      <ProductAddDialog
        open={isAddingProduct}
        onClose={() => setIsAddingProduct(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the product &ldquo;{deletingProduct?.productName}&rdquo;?</p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingProduct(null)}
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