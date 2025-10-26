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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-components"
import { getSubAdminById, updateSubAdmin } from "@/services/sub-admin"
import { SubAdmin, UpdateSubAdminRequest } from "@/types/sub-admin"
import { useToast } from "@/hooks/use-toast"


interface SubAdminEditDialogProps {
    subAdminId: string | null
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

export function SubAdminEditDialog({ subAdminId, open, onClose, onSuccess }: SubAdminEditDialogProps) {
    const { toast } = useToast()
    const [subAdmin, setSubAdmin] = useState<SubAdmin | null>(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        adminType: "Individual" as "Organisation" | "Individual",
        gstNo: "",
        contactPersonName: "",
        address: "",
        aadharCardNo: "",
        panCardNo: "",
        bankAccountNo: "",
        ifscCode: "",
        bankHolderName: "",
        passbookImage: ""
    })

    const [fieldErrors, setFieldErrors] = useState({
        name: "",
        phone: "",
        email: ""
    })

    useEffect(() => {
        if (subAdminId && open) {
            setLoading(true)
            setError(null)
            setFieldErrors({
                name: "",
                phone: "",
                email: ""
            })
            getSubAdminById(subAdminId)
                .then((subAdminData) => {
                    setSubAdmin(subAdminData)
                    setFormData({
                        name: subAdminData.name || "",
                        phone: subAdminData.phone || "",
                        email: subAdminData.email || "",
                        adminType: subAdminData.adminType || "Individual",
                        gstNo: subAdminData.gstNo || "",
                        contactPersonName: subAdminData.contactPersonName || "",
                        address: subAdminData.address || "",
                        aadharCardNo: subAdminData.aadharCardNo || "",
                        panCardNo: subAdminData.panCardNo || "",
                        bankAccountNo: subAdminData.bankAccountNo || "",
                        ifscCode: subAdminData.ifscCode || "",
                        bankHolderName: subAdminData.bankHolderName || "",
                        passbookImage: subAdminData.passbookImage || ""
                    })
                })
                .catch((err: unknown) => {
                    const errorMessage = err instanceof Error ? err.message : "Unable to load sub admin data"
                    setError(errorMessage)
                    toast({
                        title: "Failed to Load Sub Admin",
                        description: "Unable to fetch sub admin details. Please try again.",
                        variant: "destructive"
                    })
                })
                .finally(() => setLoading(false))
        }
    }, [subAdminId, open])

    const validateForm = () => {
        const errors = {
            name: "",
            phone: "",
            email: ""
        }

        if (!formData.name.trim()) {
            errors.name = "Name is required"
        }

        if (!formData.phone.trim()) {
            errors.phone = "Phone is required"
        }

        if (!formData.email.trim()) {
            errors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Please enter a valid email address"
        }

        setFieldErrors(errors)

        // Focus on first field with error
        const hasErrors = Object.values(errors).some(error => error !== "")
        if (hasErrors) {
            setTimeout(() => {
                if (errors.name) {
                    document.getElementById("name")?.focus()
                } else if (errors.phone) {
                    document.getElementById("phone")?.focus()
                } else if (errors.email) {
                    document.getElementById("email")?.focus()
                }
            }, 100)
        }

        return !hasErrors
    }

    const handleSave = async () => {
        if (!subAdminId || !subAdmin) return

        if (!validateForm()) {
            return
        }

        setSaving(true)
        try {
            const updateData: UpdateSubAdminRequest = {}

            // Only include fields that have changed
            if (formData.name !== subAdmin.name) updateData.name = formData.name
            if (formData.phone !== subAdmin.phone) updateData.phone = formData.phone
            if (formData.email !== subAdmin.email) updateData.email = formData.email
            if (formData.adminType !== subAdmin.adminType) updateData.adminType = formData.adminType
            if (formData.gstNo !== subAdmin.gstNo) updateData.gstNo = formData.gstNo
            if (formData.contactPersonName !== subAdmin.contactPersonName) updateData.contactPersonName = formData.contactPersonName
            if (formData.address !== subAdmin.address) updateData.address = formData.address
            if (formData.aadharCardNo !== subAdmin.aadharCardNo) updateData.aadharCardNo = formData.aadharCardNo
            if (formData.panCardNo !== subAdmin.panCardNo) updateData.panCardNo = formData.panCardNo
            if (formData.bankAccountNo !== subAdmin.bankAccountNo) updateData.bankAccountNo = formData.bankAccountNo
            if (formData.ifscCode !== subAdmin.ifscCode) updateData.ifscCode = formData.ifscCode
            if (formData.bankHolderName !== subAdmin.bankHolderName) updateData.bankHolderName = formData.bankHolderName
            if (formData.passbookImage !== subAdmin.passbookImage) updateData.passbookImage = formData.passbookImage

            await updateSubAdmin(subAdminId, updateData)
            toast({
                title: "Sub Admin Updated",
                description: "Sub admin details have been successfully updated.",
                variant: "success"
            })
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Error updating sub-admin:', error)
            toast({
                title: "Failed to Update Sub Admin",
                description: error instanceof Error ? error.message : 'Something went wrong while updating the sub admin. Please try again.',
                variant: "destructive"
            })
        } finally {
            setSaving(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="right" className="w-[90vw] sm:w-[80vw] lg:w-[60vw] xl:w-[50vw] max-w-4xl overflow-y-auto rounded-2xl border border-border/40 bg-background text-foreground shadow-lg">
                <SheetHeader className="bg-background/70 backdrop-blur-md border-b border-border/40">
                    <SheetTitle className="text-xl font-semibold py-0">Edit Sub Admin</SheetTitle>
                </SheetHeader>

                {loading && <LoadingSpinner message="Loading sub admin..." />}

                {error && (
                    <div className="text-red-600 text-center py-4">{error}</div>
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
                                    <Label htmlFor="name" className="mb-2">Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, name: e.target.value }))
                                            if (fieldErrors.name) {
                                                setFieldErrors(prev => ({ ...prev, name: "" }))
                                            }
                                        }}
                                        placeholder="Enter sub admin name"
                                        disabled={saving}
                                        className={fieldErrors.name ? "border-red-500 focus:border-red-500" : ""}
                                    />
                                    {fieldErrors.name && (
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="adminType" className="mb-2">Admin Type *</Label>
                                    <Select
                                        value={formData.adminType}
                                        onValueChange={(value: "Organisation" | "Individual") =>
                                            setFormData(prev => ({ ...prev, adminType: value }))
                                        }
                                        disabled={saving}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select admin type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Individual">Individual</SelectItem>
                                            <SelectItem value="Organisation">Organisation</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="email" className="mb-2">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, email: e.target.value }))
                                            if (fieldErrors.email) {
                                                setFieldErrors(prev => ({ ...prev, email: "" }))
                                            }
                                        }}
                                        placeholder="Enter email address"
                                        disabled={saving}
                                        className={fieldErrors.email ? "border-red-500 focus:border-red-500" : ""}
                                    />
                                    {fieldErrors.email && (
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="phone" className="mb-2">Phone *</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, phone: e.target.value }))
                                            if (fieldErrors.phone) {
                                                setFieldErrors(prev => ({ ...prev, phone: "" }))
                                            }
                                        }}
                                        placeholder="Enter phone number"
                                        disabled={saving}
                                        className={fieldErrors.phone ? "border-red-500 focus:border-red-500" : ""}
                                    />
                                    {fieldErrors.phone && (
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.phone}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="address" className="mb-2">Address</Label>
                                    <Textarea
                                        id="address"
                                        rows={3}
                                        value={formData.address}
                                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                        placeholder="Enter complete address"
                                        disabled={saving}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* ---------- Organisation Details ---------- */}
                        {formData.adminType === "Organisation" && (
                            <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                                <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                                    Organisation Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="gstNo" className="mb-2">GST Number</Label>
                                        <Input
                                            id="gstNo"
                                            value={formData.gstNo}
                                            onChange={(e) => setFormData(prev => ({ ...prev, gstNo: e.target.value }))}
                                            placeholder="Enter GST number"
                                            disabled={saving}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="contactPersonName" className="mb-2">Contact Person Name</Label>
                                        <Input
                                            id="contactPersonName"
                                            value={formData.contactPersonName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, contactPersonName: e.target.value }))}
                                            placeholder="Enter contact person name"
                                            disabled={saving}
                                        />
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* ---------- Identity Information ---------- */}
                        <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                            <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                                Identity Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="aadharCardNo" className="mb-2">Aadhaar Card Number</Label>
                                    <Input
                                        id="aadharCardNo"
                                        value={formData.aadharCardNo}
                                        onChange={(e) => setFormData(prev => ({ ...prev, aadharCardNo: e.target.value }))}
                                        placeholder="Enter Aadhaar card number"
                                        disabled={saving}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="panCardNo" className="mb-2">PAN Card Number</Label>
                                    <Input
                                        id="panCardNo"
                                        value={formData.panCardNo}
                                        onChange={(e) => setFormData(prev => ({ ...prev, panCardNo: e.target.value }))}
                                        placeholder="Enter PAN card number"
                                        disabled={saving}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* ---------- Banking Information ---------- */}
                        <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                            <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                                Banking Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="bankHolderName" className="mb-2">Account Holder Name</Label>
                                    <Input
                                        id="bankHolderName"
                                        value={formData.bankHolderName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, bankHolderName: e.target.value }))}
                                        placeholder="Enter account holder name"
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="bankAccountNo" className="mb-2">Account Number</Label>
                                    <Input
                                        id="bankAccountNo"
                                        value={formData.bankAccountNo}
                                        onChange={(e) => setFormData(prev => ({ ...prev, bankAccountNo: e.target.value }))}
                                        placeholder="Enter account number"
                                        disabled={saving}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="ifscCode" className="mb-2">IFSC Code</Label>
                                    <Input
                                        id="ifscCode"
                                        value={formData.ifscCode}
                                        onChange={(e) => setFormData(prev => ({ ...prev, ifscCode: e.target.value }))}
                                        placeholder="Enter IFSC code"
                                        disabled={saving}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                <SheetFooter className="flex flex-row justify-end gap-3 border-t border-border/40 pt-4 sm:flex-row">
                    <Button variant="outline" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving || loading || !!error}>
                        {saving ? "Updating..." : "Update Sub Admin"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}