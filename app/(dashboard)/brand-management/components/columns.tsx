"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react"

import { Brand } from "@/types/brand"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BrandColumnsProps {
    onEdit?: (brand: Brand) => void
    onDelete?: (brand: Brand) => void
}

export const createBrandColumns = ({ onEdit, onDelete }: BrandColumnsProps = {}): ColumnDef<Brand>[] => [
    {
        accessorKey: "brandName",
        header: "Brand Name",
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("brandName")}</div>
        ),
    },
    {
        accessorKey: "brandDetails",
        header: "Brand Details",
        cell: ({ row }) => (
            <div className="max-w-xs truncate text-muted-foreground">
                {row.getValue("brandDetails")}
            </div>
        ),
    },
    {
        accessorKey: "productCategory",
        header: "Product Categories",
        cell: ({ row }) => {
            const categories = row.getValue("productCategory") as string[]
            return (
                <div className="flex flex-wrap gap-1">
                    {categories.slice(0, 2).map((category, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800/30">
                            {category}
                        </Badge>
                    ))}
                    {categories.length > 2 && (
                        <Badge variant="outline" className="text-xs bg-muted text-muted-foreground border-border">
                            +{categories.length - 2}
                        </Badge>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "quality",
        header: "Quality",
        cell: ({ row }) => {
            const quality = row.getValue("quality") as string
            return (
                <Badge
                    variant="outline"
                    className={`text-xs font-medium ${quality === "Premium"
                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/30"
                        : "bg-muted text-muted-foreground border-border"
                        }`}
                >
                    {quality}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const brand = row.original

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
                            onClick={() => onEdit?.(brand)}
                        >
                            <IconEdit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete?.(brand)}
                            className="text-red-600"
                        >
                            <IconTrash className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

// Backward compatibility
export const brandColumns = createBrandColumns()