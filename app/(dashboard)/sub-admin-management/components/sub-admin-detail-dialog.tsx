"use client"

import { useState, useEffect } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-components"
import { getSubAdminById } from "@/services/sub-admin"
import { SubAdmin } from "@/types/sub-admin"
import { useToast } from "@/hooks/use-toast"

interface SubAdminDetailDialogProps {
    subAdminId: string | null
    open: boolean
    onClose: () => void
}

export function SubAdminDetailDialog({ subAdminId, open, onClose }: SubAdminDetailDialogProps) {
    const { toast } = useToast()
    const [subAdmin, setSubAdmin] = useState<SubAdmin | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (subAdminId && open) {
            setLoading(true)
            setError(null)
            getSubAdminById(subAdminId)
                .then(setSubAdmin)
                .catch((err: unknown) => {
                    const errorMessage = err instanceof Error ? err.message : "Failed to load sub admin details"
                    setError(errorMessage)
                    toast({
                        title: "Error",
                        description: "Failed to load sub admin details. Please try again.",
                        variant: "destructive"
                    })
                })
                .finally(() => setLoading(false))
        }
    }, [subAdminId, open])

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="right"
                className="w-[90vw] sm:w-[80vw] lg:w-[60vw] xl:w-[50vw] max-w-4xl overflow-y-auto rounded-2xl border border-border/40 bg-zinc-100 dark:bg-background text-foreground shadow-lg">
                <SheetHeader className="bg-zinc-100/70 dark:bg-background/70 backdrop-blur-md border-b border-border/40">
                    <SheetTitle className="text-xl font-semibold py-0">Sub Admin Details</SheetTitle>
                </SheetHeader>

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <LoadingSpinner message="Loading sub admin details..." />
                    </div>
                )}

                {error && (
                    <div className="text-red-600 text-center py-8 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}

                {subAdmin && !loading && !error && (
                    <div className="space-y-8 py-4 px-6">
                        {/* ---------- Basic Information ---------- */}
                        <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                            <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2">Full Name</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-medium">
                                        {subAdmin.name}
                                    </div>
                                </div>

                                <div>
                                    <Label className="mb-2">Admin Type</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                        {subAdmin.adminType}
                                    </div>
                                </div>

                                <div>
                                    <Label className="mb-2">Email</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                        {subAdmin.email}
                                    </div>
                                </div>

                                <div>
                                    <Label className="mb-2">Phone</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                        {subAdmin.phone}
                                    </div>
                                </div>

                                {subAdmin.address && (
                                    <div className="md:col-span-2">
                                        <Label className="mb-2">Address</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                            {subAdmin.address}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* ---------- Organisation Details ---------- */}
                        {subAdmin.adminType === "Organisation" && (subAdmin.gstNo || subAdmin.contactPersonName) && (
                            <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                                <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                                    Organisation Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {subAdmin.gstNo && (
                                        <div>
                                            <Label className="mb-2">GST Number</Label>
                                            <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                {subAdmin.gstNo}
                                            </div>
                                        </div>
                                    )}
                                    {subAdmin.contactPersonName && (
                                        <div>
                                            <Label className="mb-2">Contact Person Name</Label>
                                            <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                {subAdmin.contactPersonName}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* ---------- Identity Information ---------- */}
                        {(subAdmin.aadharCardNo || subAdmin.panCardNo) && (
                            <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                                <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                                    Identity Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {subAdmin.aadharCardNo && (
                                        <div>
                                            <Label className="mb-2">Aadhaar Card Number</Label>
                                            <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                {subAdmin.aadharCardNo}
                                            </div>
                                        </div>
                                    )}
                                    {subAdmin.panCardNo && (
                                        <div>
                                            <Label className="mb-2">PAN Card Number</Label>
                                            <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                {subAdmin.panCardNo}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* ---------- Banking Information ---------- */}
                        {(subAdmin.bankHolderName || subAdmin.bankAccountNo || subAdmin.ifscCode) && (
                            <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                                <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                                    Banking Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {subAdmin.bankHolderName && (
                                        <div>
                                            <Label className="mb-2">Account Holder Name</Label>
                                            <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                {subAdmin.bankHolderName}
                                            </div>
                                        </div>
                                    )}

                                    {subAdmin.bankAccountNo && (
                                        <div>
                                            <Label className="mb-2">Account Number</Label>
                                            <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                {subAdmin.bankAccountNo}
                                            </div>
                                        </div>
                                    )}

                                    {subAdmin.ifscCode && (
                                        <div>
                                            <Label className="mb-2">IFSC Code</Label>
                                            <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                {subAdmin.ifscCode}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* ---------- Account Information ---------- */}
                        <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                            <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                                Account Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {subAdmin.createdAt && (
                                    <div>
                                        <Label className="mb-2">Created At</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                            {new Date(subAdmin.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                )}
                                {subAdmin.updatedAt && (
                                    <div>
                                        <Label className="mb-2">Last Updated</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                            {new Date(subAdmin.updatedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}

                <SheetFooter className="flex flex-row justify-end gap-3 border-t border-border/40 pt-4 sm:flex-row">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}