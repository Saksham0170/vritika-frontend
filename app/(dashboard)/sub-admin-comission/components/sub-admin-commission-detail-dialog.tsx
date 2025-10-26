"use client"

import { useEffect, useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getRoleCommissionBySubAdminId } from "@/services/role-commission"
import { RoleCommission } from "@/types/role-commission"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"

interface RoleCommissionDetailDialogProps {
    subAdminId: string | null
    open: boolean
    onClose: () => void
}

export function RoleCommissionDetailDialog({
    subAdminId,
    open,
    onClose,
}: RoleCommissionDetailDialogProps) {
    const [roleCommission, setRoleCommission] = useState<RoleCommission | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (subAdminId && open) {
            const fetchRoleCommission = async () => {
                try {
                    setLoading(true)
                    setError(null)
                    const data = await getRoleCommissionBySubAdminId(subAdminId)
                    setRoleCommission(data)
                } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to load sub-admin commission details")
                    console.error("Error fetching sub-admin commission:", err)
                } finally {
                    setLoading(false)
                }
            }

            fetchRoleCommission()
        }
    }, [subAdminId, open])

    const handleClose = () => {
        onClose()
        setRoleCommission(null)
        setError(null)
    }

    if (!open) return null

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent side="right"
                className="w-[90vw] sm:w-[80vw] lg:w-[60vw] xl:w-[50vw] max-w-4xl overflow-y-auto rounded-2xl border border-border/40 bg-zinc-100 dark:bg-background text-foreground shadow-lg">
                <SheetHeader className="bg-zinc-100/70 dark:bg-background/70 backdrop-blur-md border-b border-border/40">
                    <SheetTitle className="text-xl font-semibold py-0">Sub-Admin Commission Details</SheetTitle>
                </SheetHeader>

                {loading ? (
                    <div className="space-y-4 mt-6">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                ) : error ? (
                    <div className="text-red-600 text-center py-4 mt-6 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                ) : roleCommission ? (
                    <div className="space-y-8 py-4 px-6">
                        {/* Sub-Admin Details */}
                        <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                            <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                                Sub-Admin Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2">Sub-Admin Name</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-medium">
                                        {roleCommission.subAdminId?.name || "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <Label className="mb-2">Sub-Admin Email</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                        {roleCommission.subAdminId?.email || "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <Label className="mb-2">Sub-Admin Level</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-medium">
                                        Level {roleCommission.subAdminId?.level || "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <Label className="mb-2">Sub-Admin Code</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-medium">
                                        {roleCommission.subAdminId?.code || "N/A"}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Root Admin Details */}
                        <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                            <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                                Root Admin Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2">Root Admin Name</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-medium">
                                        {roleCommission.rootAdminId?.name || "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <Label className="mb-2">Root Admin Email</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                        {roleCommission.rootAdminId?.email || "N/A"}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Commission Details */}
                        <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                            <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                                Commission Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2">Level</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-medium">
                                        Level {roleCommission.level}
                                    </div>
                                </div>
                                <div>
                                    <Label className="mb-2">Commission Percentage</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-medium">
                                        {roleCommission.commissionPercentage}%
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label className="mb-2">Description</Label>
                                <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                    {roleCommission.description}
                                </div>
                            </div>

                            <div>
                                <Label className="mb-2">Status</Label>
                                <div className="flex">
                                    <Badge
                                        variant={roleCommission.status ? "default" : "secondary"}
                                        className={roleCommission.status ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}
                                    >
                                        {roleCommission.status ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                            <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                                Timestamps
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2">Created At</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                        {new Date(roleCommission.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <Label className="mb-2">Updated At</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                        {new Date(roleCommission.updatedAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                ) : null}
            </SheetContent>
        </Sheet>
    )
}