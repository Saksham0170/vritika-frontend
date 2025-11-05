"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react"

import { Product, ProductType } from "@/types/product"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProductColumnsProps {
    onEdit: (product: Product) => void
    onDelete: (product: Product) => void
    activeType: ProductType
}

export const createProductColumns = ({ onEdit, onDelete, activeType }: ProductColumnsProps): ColumnDef<Product>[] => {
    // Types that don't need brand column
    const typesWithoutBrand: ProductType[] = ["Structure", "BOS", "Service", "Kit", "Services/Freebies"]
    const shouldShowBrand = !typesWithoutBrand.includes(activeType)

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: "productName",
            header: "Product Name",
            cell: ({ row }) => {
                const productName = row.getValue("productName") as string
                return (
                    <div className="font-medium">{productName}</div>
                )
            },
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => {
                const price = row.getValue("price") as number
                return (
                    <div className="font-medium">₹{price.toLocaleString()}</div>
                )
            },
        },
    ]

    // Conditionally add brand column
    if (shouldShowBrand) {
        columns.push({
            accessorKey: "brandDetails",
            header: "Brand",
            cell: ({ row }) => {
                const product = row.original
                const brandName = product.brandDetails?.brandName
                return (
                    <div className="font-medium">
                        {brandName || <span className="text-muted-foreground">-</span>}
                    </div>
                )
            },
        })
    }

    // Add actions column at the end
    columns.push({
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const product = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <IconDotsVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => onEdit(product)}
                        >
                            <IconEdit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(product)}
                            className="text-red-600"
                        >
                            <IconTrash className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    })

    return columns
}