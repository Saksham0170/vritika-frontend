"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IconDotsVertical, IconEdit, IconTrash, IconUsers } from "@tabler/icons-react"

import { Coupon } from "@/types/coupon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CouponColumnsProps {
    onEdit?: (coupon: Coupon) => void
    onDelete?: (coupon: Coupon) => void
    onManageSalespeople?: (coupon: Coupon) => void
}

export const createCouponColumns = ({ onEdit, onDelete, onManageSalespeople }: CouponColumnsProps = {}): ColumnDef<Coupon>[] => [
    {
        accessorKey: "couponCode",
        header: "Coupon Code",
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("couponCode")}</div>
        ),
    },
    {
        accessorKey: "discountValue",
        header: "Discount",
        cell: ({ row }) => {
            const discountValue = row.getValue("discountValue") as number
            const discountType = row.original.discountType
            return (
                <div className="font-medium">
                    {discountType === "percentage" ? `${discountValue}%` : `₹${discountValue}`}
                </div>
            )
        },
    },
    {
        accessorKey: "maxDiscountAmount",
        header: "Max Discount",
        cell: ({ row }) => (
            <div className="font-medium">₹{row.getValue("maxDiscountAmount")}</div>
        ),
    },
    {
        accessorKey: "minOrderAmount",
        header: "Min Order",
        cell: ({ row }) => (
            <div className="font-medium">₹{row.getValue("minOrderAmount")}</div>
        ),
    },
    {
        accessorKey: "validFrom",
        header: "Valid From",
        cell: ({ row }) => {
            const validFrom = row.getValue("validFrom") as string
            return (
                <div className="text-sm">
                    {new Date(validFrom).toLocaleDateString()}
                </div>
            )
        },
    },
    {
        accessorKey: "validUntil",
        header: "Valid Until",
        cell: ({ row }) => {
            const validUntil = row.getValue("validUntil") as string
            const isExpired = new Date(validUntil) < new Date()
            return (
                <div className={`text-sm ${isExpired ? 'text-red-600' : ''}`}>
                    {new Date(validUntil).toLocaleDateString()}
                </div>
            )
        },
    },
    {
        accessorKey: "maxUsageCount",
        header: "Usage",
        cell: ({ row }) => {
            const maxUsage = row.getValue("maxUsageCount") as number
            const currentUsage = row.original.currentUsageCount
            return (
                <div className="text-sm">
                    {currentUsage}/{maxUsage}
                </div>
            )
        },
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.getValue("isActive") as boolean
            const status = row.original.status
            return (
                <Badge
                    variant="outline"
                    className={`text-xs font-medium ${isActive && status === "active"
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800/30"
                        : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800/30"
                        }`}
                >
                    {isActive && status === "active" ? "Active" : "Inactive"}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const coupon = row.original

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
                            onClick={() => onEdit?.(coupon)}
                        >
                            <IconEdit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onManageSalespeople?.(coupon)}
                        >
                            <IconUsers className="mr-2 h-4 w-4" />
                            Manage Salespeople
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete?.(coupon)}
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