"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-components"
import { getAdminById } from "@/services/admin"
import { Admin } from "@/types/admin"

interface AdminDetailDialogProps {
    adminId: string | null
    open: boolean
    onClose: () => void
}

export function AdminDetailDialog({ adminId, open, onClose }: AdminDetailDialogProps) {
    const [admin, setAdmin] = useState<Admin | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (adminId && open) {
            setLoading(true)
            setError(null)
            getAdminById(adminId)
                .then(setAdmin)
                .catch((err: unknown) => {
                    const errorMessage = err instanceof Error ? err.message : "Failed to load admin details"
                    setError(errorMessage)
                })
                .finally(() => setLoading(false))
        }
    }, [adminId, open])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/40 bg-background text-foreground shadow-lg">
                <DialogHeader className="bg-background/70 backdrop-blur-md border-b border-border/40">
                    <DialogTitle className="text-xl font-semibold py-0">Admin Details</DialogTitle>
                </DialogHeader>

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <LoadingSpinner message="Loading admin details..." />
                    </div>
                )}

                {error && (
                    <div className="text-red-600 text-center py-8 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}

                {admin && !loading && !error && (
                    <div className="space-y-8 py-4">
                        {/* ---------- Basic Information ---------- */}
                        <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                            <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2">Full Name</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-medium">
                                        {admin.name}
                                    </div>
                                </div>

                                <div>
                                    <Label className="mb-2">Admin Type</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                        {admin.adminType}
                                    </div>
                                </div>

                                <div>
                                    <Label className="mb-2">Email</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                        {admin.email}
                                    </div>
                                </div>

                                <div>
                                    <Label className="mb-2">Phone</Label>
                                    <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                        {admin.phone}
                                    </div>
                                </div>

                                {admin.address && (
                                    <div className="md:col-span-2">
                                        <Label className="mb-2">Address</Label>
                                        <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                            {admin.address}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* ---------- Organisation Details ---------- */}
                        {(admin.adminType === "Organisation" && (admin.gstNo || admin.contactPersonName)) && (
                            <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                                <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                                    Organisation Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {admin.gstNo && (
                                        <div>
                                            <Label className="mb-2">GST Number</Label>
                                            <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-mono">
                                                {admin.gstNo}
                                            </div>
                                        </div>
                                    )}
                                    {admin.contactPersonName && (
                                        <div>
                                            <Label className="mb-2">Contact Person Name</Label>
                                            <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                {admin.contactPersonName}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* ---------- Identity Information ---------- */}
                        {(admin.aadharCardNo || admin.panCardNo) && (
                            <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                                <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                                    Identity Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {admin.aadharCardNo && (
                                        <div>
                                            <Label className="mb-2">Aadhaar Card Number</Label>
                                            <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-mono">
                                                {admin.aadharCardNo}
                                            </div>
                                        </div>
                                    )}
                                    {admin.panCardNo && (
                                        <div>
                                            <Label className="mb-2">PAN Card Number</Label>
                                            <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-mono">
                                                {admin.panCardNo}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* ---------- Banking Information ---------- */}
                        {(admin.bankAccountNo || admin.ifscCode || admin.bankHolderName) && (
                            <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                                <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                                    Banking Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {admin.bankHolderName && (
                                        <div>
                                            <Label className="mb-2">Account Holder Name</Label>
                                            <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                                {admin.bankHolderName}
                                            </div>
                                        </div>
                                    )}
                                    {admin.bankAccountNo && (
                                        <div>
                                            <Label className="mb-2">Account Number</Label>
                                            <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-mono">
                                                {admin.bankAccountNo}
                                            </div>
                                        </div>
                                    )}
                                    {admin.ifscCode && (
                                        <div>
                                            <Label className="mb-2">IFSC Code</Label>
                                            <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-mono">
                                                {admin.ifscCode}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>
                )}

                <DialogFooter className="flex justify-end gap-3 border-t border-border/40 pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}