"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Product } from "@/types/product"

interface ProductColumnsProps {
    onEdit: (product: Product) => void
    onDelete: (product: Product) => void
}

export const createProductColumns = ({ onEdit, onDelete }: ProductColumnsProps): ColumnDef<Product>[] => [
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
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("type") as string
            const getTypeVariant = (type: string) => {
                switch (type) {
                    case "Solar Module":
                        return "default"
                    case "Inverter":
                        return "secondary"
                    case "Kit":
                        return "outline"
                    case "BOS":
                        return "outline"
                    case "Structure":
                        return "outline"
                    default:
                        return "outline"
                }
            }
            return (
                <Badge variant={getTypeVariant(type)}>
                    {type}
                </Badge>
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
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const product = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(product._id)}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Copy product ID
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit product
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(product)}
                            className="text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete product
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]