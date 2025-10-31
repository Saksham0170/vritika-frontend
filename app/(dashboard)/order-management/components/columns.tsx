"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Order } from "@/types/order"

export const createOrderColumns = (): ColumnDef<Order>[] => [
    {
        accessorKey: "salesPersonId",
        header: "Salesperson ID",
        cell: ({ row }) => {
            const id = row.getValue("salesPersonId") as string
            return (
                <div className="font-mono text-xs break-all max-w-[140px]">
                    {id}
                </div>
            )
        },
        size: 140,
    },
    {
        accessorKey: "customer.customerPhoneNo",
        header: "Phone",
        cell: ({ row }) => {
            const phone = row.original.customer.customerPhoneNo
            return (
                <div className="flex items-center gap-2">
                    <span className="text-sm">{phone}</span>
                </div>
            )
        },
        size: 130,
    },
    {
        accessorKey: "customer.customerContactName",
        header: "Customer Name",
        cell: ({ row }) => {
            const name = row.original.customer.customerContactName
            return (
                <div className="font-medium text-sm">
                    {name}
                </div>
            )
        },
        size: 160,
    },
    {
        accessorKey: "customer.emailId",
        header: "Email",
        cell: ({ row }) => {
            const email = row.original.customer.emailId
            return (
                <div className="text-sm text-muted-foreground max-w-[200px] truncate" title={email}>
                    {email}
                </div>
            )
        },
        size: 200,
    },
    {
        accessorKey: "customer.state",
        header: "Location",
        cell: ({ row }) => {
            const state = row.original.customer.state
            const district = row.original.customer.district
            return (
                <div className="space-y-1">
                    <div className="text-sm font-medium">{state}</div>
                    <div className="text-xs text-muted-foreground">{district}</div>
                </div>
            )
        },
        size: 150,
    },
]