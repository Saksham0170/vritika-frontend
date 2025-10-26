"use client"

import { useState, useEffect } from "react"
import { createProductColumns } from "./components/columns"
import { DataTable } from "@/components/data-table"
import { deleteProduct, getProductsPaginated } from "@/services/product"
import { Product, ProductType } from "@/types/product"
import { ProductDetailDialog } from "./components/product-detail-dialog"
import { ProductEditDialog } from "./components/product-edit-dialog"
import { ProductAddDialog } from "./components/product-add-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Product type configurations
const PRODUCT_TYPES: ProductType[] = [
  "Solar Module",
  "Inverter",
  "Batteries",
  "Cables",
  "Structure",
  "BOS",
  "Service",
  "Kit",
  "Services/Freebies"
]


const getActiveButtonClass = () => {
  return "bg-accent text-accent-foreground border-accent shadow-sm"
}

export default function ProductManagementPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState<ProductType>("Solar Module")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  const loadProducts = async (page: number = currentPage, limit: number = pageSize, type?: ProductType) => {
    try {
      setLoading(true)
      const response = await getProductsPaginated({
        page,
        limit,
        type: type || activeTab
      })
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
  }, [activeTab])

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

  const handleTabChange = (newTab: ProductType) => {
    setActiveTab(newTab)
    setCurrentPage(1)
    setProducts([])
    // loadProducts will be called by useEffect
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
      toast({
        title: "Success",
        description: "Product deleted successfully",
        variant: "success"
      })
    } catch (error: unknown) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error deleting product",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      })
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
    <div className="max-w-screen-xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="pb-4 border-b border-border/40">
        <h1 className="text-2xl font-bold tracking-tight">Product Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage different types of products efficiently by categorizing them below.
        </p>
      </div>

      {/* Product Type Navigation */}
      <div className="flex flex-wrap gap-2">
        {PRODUCT_TYPES.map((type) => {
          const isActive = activeTab === type
          return (
            <Button
              key={type}
              variant="ghost"
              onClick={() => handleTabChange(type)}
              className={`flex items-center justify-center gap-2 h-auto p-3 rounded-lg transition-all duration-200 border ${isActive
                ? getActiveButtonClass()
                : 'hover:bg-accent/30 border-transparent'
                }`}
            >
              {type}
            </Button>
          )
        })}
      </div>

      {/* Content for each type */}
      <div>
        <DataTable
          columns={productColumns}
          data={products}
          searchKey="productName"
          searchPlaceholder={`Search ${activeTab.toLowerCase()} ...`}
          onAdd={() => handleAddProduct()}
          addButtonText={`Add ${activeTab}`}
          loading={loading}
          error={error}
          onRowClick={handleRowClick}
          paginationMode="server"
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>

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
        selectedType={activeTab}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <DialogContent className="rounded-xl">
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
    </div>
  )
}