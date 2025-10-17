"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react"

import { SubAdmin } from "@/types/sub-admin"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SubAdminColumnsProps {
    onEdit?: (subAdmin: SubAdmin) => void
    onDelete?: (subAdmin: SubAdmin) => void
}

export const createSubAdminColumns = ({ onEdit, onDelete }: SubAdminColumnsProps = {}): ColumnDef<SubAdmin>[] => [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
            <div className="text-muted-foreground">{row.getValue("phone")}</div>
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
        accessorKey: "adminType",
        header: "Admin Type",
        cell: ({ row }) => {
            const adminType = row.getValue("adminType") as string
            return (
                <Badge
                    variant="outline"
                    className={`text-xs font-medium ${adminType === "Organisation"
                        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/30"
                        : "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800/30"
                        }`}
                >
                    {adminType}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const subAdmin = row.original

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
                            onClick={() => onEdit?.(subAdmin)}
                        >
                            <IconEdit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete?.(subAdmin)}
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
export const subAdminColumns = createSubAdminColumns()