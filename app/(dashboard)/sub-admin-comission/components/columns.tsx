"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react"

import { RoleCommission } from "@/types/role-commission"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface RoleCommissionColumnsProps {
    onEdit?: (roleCommission: RoleCommission) => void
    onDelete?: (roleCommission: RoleCommission) => void
}

export const createRoleCommissionColumns = ({ onEdit, onDelete }: RoleCommissionColumnsProps = {}): ColumnDef<RoleCommission>[] => [
    {
        accessorKey: "subAdminId.name",
        header: "Sub Admin Name",
        cell: ({ row }) => (
            <div className="font-medium">{row.original.subAdminId?.name || "N/A"}</div>
        ),
    },
    {
        accessorKey: "subAdminId.email",
        header: "Sub Admin Email",
        cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.subAdminId?.email || "N/A"}</div>
        ),
    },
    {
        accessorKey: "subAdminId.level",
        header: "Level",
        cell: ({ row }) => (
            <div className="font-medium">Level {row.original.subAdminId?.level || "N/A"}</div>
        ),
    },
    {
        accessorKey: "commissionPercentage",
        header: "Commission Percentage",
        cell: ({ row }) => (
            <div className="text-muted-foreground">{row.getValue("commissionPercentage")}%</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as boolean
            return (
                <Badge
                    variant={status ? "default" : "secondary"}
                    className={status ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-green-200"}
                >
                    {status ? "Active" : "Inactive"}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const roleCommission = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                        >
                            <IconDotsVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem
                            onClick={() => onEdit?.(roleCommission)}
                            className="cursor-pointer"
                        >
                            <IconEdit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete?.(roleCommission)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
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