"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IconDotsVertical, IconEdit, IconTrash, IconExternalLink } from "@tabler/icons-react"

import { KnowledgeCenterEntry } from "@/types/knowledge-center"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface KnowledgeCenterColumnsProps {
    onEdit?: (entry: KnowledgeCenterEntry) => void
    onDelete?: (entry: KnowledgeCenterEntry) => void
}

export const createKnowledgeCenterColumns = ({ onEdit, onDelete }: KnowledgeCenterColumnsProps = {}): ColumnDef<KnowledgeCenterEntry>[] => [
    {
        accessorKey: "adminId",
        header: "Admin ID",
        cell: ({ row }) => (
            <div className="font-mono text-sm text-muted-foreground">
                {row.getValue("adminId")}
            </div>
        ),
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("type") as string
            return (
                <Badge
                    variant="outline"
                    className={`text-xs font-medium ${type === "video"
                            ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/30"
                            : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800/30"
                        }`}
                >
                    {type.toUpperCase()}
                </Badge>
            )
        },
    },
    {
        accessorKey: "url",
        header: "URL",
        cell: ({ row }) => {
            const url = row.getValue("url") as string
            const type = row.original.type

            return (
                <div className="flex items-center gap-2 max-w-xs">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate flex items-center gap-1 text-sm"
                    >
                        <span className="truncate">{url}</span>
                        <IconExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as boolean
            return (
                <Badge
                    variant="outline"
                    className={`text-xs font-medium ${status
                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800/30"
                            : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-300 dark:border-gray-800/30"
                        }`}
                >
                    {status ? "Active" : "Inactive"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return (
                <div className="text-sm text-muted-foreground">
                    {date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </div>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const entry = row.original

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
                            onClick={() => onEdit?.(entry)}
                        >
                            <IconEdit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete?.(entry)}
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
