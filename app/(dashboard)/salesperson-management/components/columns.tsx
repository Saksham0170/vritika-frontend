"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react"

import { Salesperson } from "@/types/salesperson"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SalespersonColumnsProps {
    onEdit?: (salesperson: Salesperson) => void
    onDelete?: (salesperson: Salesperson) => void
}

export const createSalespersonColumns = ({ onEdit, onDelete }: SalespersonColumnsProps = {}): ColumnDef<Salesperson>[] => [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone",
        cell: ({ row }) => (
            <div className="text-muted-foreground">{row.getValue("phoneNumber")}</div>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div className="text-muted-foreground">{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    variant="outline"
                    className={`text-xs font-medium ${status === "Active"
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800/30"
                        : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800/30"
                        }`}
                >
                    {status}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const salesperson = row.original

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
                            onClick={() => onEdit?.(salesperson)}
                        >
                            <IconEdit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete?.(salesperson)}
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
export const salespersonColumns = createSalespersonColumns()