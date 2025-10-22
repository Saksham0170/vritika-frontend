"use client"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Salesperson } from "@/types/salesperson"

interface SalespersonDetailDialogProps {
    open: boolean
    onClose: () => void
    salesperson: Salesperson | null
}

export function SalespersonDetailDialog({ open, onClose, salesperson }: SalespersonDetailDialogProps) {
    if (!salesperson) return null

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return "N/A"
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
        } catch {
            return dateStr
        }
    }

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="right" className="w-[90vw] sm:w-[80vw] lg:w-[60vw] xl:w-[50vw] max-w-4xl overflow-y-auto rounded-2xl border border-border/40 bg-zinc-100 dark:bg-background text-foreground shadow-lg">
                <SheetHeader className="bg-zinc-100/70 dark:bg-background/70 backdrop-blur-md border-b border-border/40">
                    <SheetTitle className="text-xl font-semibold py-0">Salesperson Details</SheetTitle>
                </SheetHeader>

                <div className="space-y-8 py-4 px-6">
                    {/* ---------- Basic Information ---------- */}
                    <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                        <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="mb-2">Name</Label>
                                <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                    {salesperson.name || "N/A"}
                                </div>
                            </div>

                            <div>
                                <Label className="mb-2">Phone Number</Label>
                                <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                    {salesperson.phoneNumber || "N/A"}
                                </div>
                            </div>

                            <div>
                                <Label className="mb-2">Email</Label>
                                <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                    {salesperson.email || "N/A"}
                                </div>
                            </div>

                            <div>
                                <Label className="mb-2">Status</Label>
                                <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                    {salesperson.status || "N/A"}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <Label className="mb-2">Address</Label>
                                <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm whitespace-pre-wrap">
                                    {salesperson.address || "N/A"}
                                </div>
                            </div>                            {salesperson.selfie && (
                                <div>
                                    <Label className="mb-2">Selfie</Label>
                                    <div className="mt-2">
                                        <img
                                            src={salesperson.selfie}
                                            alt="Selfie"
                                            className="w-24 h-24 object-cover rounded-lg border border-border"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.nextElementSibling!.textContent = 'Image failed to load';
                                            }}
                                        />
                                        <p className="text-sm text-muted-foreground mt-1 hidden">Image failed to load</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ---------- Identity Information ---------- */}
                    <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                        <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                            Identity Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="mb-2">Aadhaar Card Number</Label>
                                <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-mono">
                                    {salesperson.aadharCardNumber || "N/A"}
                                </div>
                            </div>

                            <div>
                                <Label className="mb-2">PAN Card Number</Label>
                                <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-mono">
                                    {salesperson.panCardNumber || "N/A"}
                                </div>
                            </div>

                            {salesperson.aadharCardFront && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Aadhaar Card Front</label>
                                    <div className="mt-2">
                                        <img
                                            src={salesperson.aadharCardFront}
                                            alt="Aadhaar Card Front"
                                            className="w-32 h-20 object-cover rounded-lg border border-border"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.nextElementSibling!.textContent = 'Image failed to load';
                                            }}
                                        />
                                        <p className="text-sm text-muted-foreground mt-1 hidden">Image failed to load</p>
                                    </div>
                                </div>
                            )}

                            {salesperson.aadharCardBack && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Aadhaar Card Back</label>
                                    <div className="mt-2">
                                        <img
                                            src={salesperson.aadharCardBack}
                                            alt="Aadhaar Card Back"
                                            className="w-32 h-20 object-cover rounded-lg border border-border"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.nextElementSibling!.textContent = 'Image failed to load';
                                            }}
                                        />
                                        <p className="text-sm text-muted-foreground mt-1 hidden">Image failed to load</p>
                                    </div>
                                </div>
                            )}

                            {salesperson.panCardFront && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">PAN Card Front</label>
                                    <div className="mt-2">
                                        <img
                                            src={salesperson.panCardFront}
                                            alt="PAN Card Front"
                                            className="w-32 h-20 object-cover rounded-lg border border-border"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.nextElementSibling!.textContent = 'Image failed to load';
                                            }}
                                        />
                                        <p className="text-sm text-muted-foreground mt-1 hidden">Image failed to load</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ---------- Banking Information ---------- */}
                    <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                        <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                            Banking Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="mb-2">Account Holder Name</Label>
                                <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm">
                                    {salesperson.bankAccountName || "N/A"}
                                </div>
                            </div>

                            <div>
                                <Label className="mb-2">Account Number</Label>
                                <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-mono">
                                    {salesperson.bankAccountNumber || "N/A"}
                                </div>
                            </div>

                            <div>
                                <Label className="mb-2">IFSC Code</Label>
                                <div className="p-3 bg-muted/50 rounded-md border border-border/30 text-sm font-mono">
                                    {salesperson.bankIfscCode || "N/A"}
                                </div>
                            </div>

                            {salesperson.cancelChequePhoto && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Cancel Cheque Photo</label>
                                    <div className="mt-2">
                                        <img
                                            src={salesperson.cancelChequePhoto}
                                            alt="Cancel Cheque"
                                            className="w-32 h-20 object-cover rounded-lg border border-border"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.nextElementSibling!.textContent = 'Image failed to load';
                                            }}
                                        />
                                        <p className="text-sm text-muted-foreground mt-1 hidden">Image failed to load</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </SheetContent>
        </Sheet>
    )
}