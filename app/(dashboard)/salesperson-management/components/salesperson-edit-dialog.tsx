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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FileUpload } from "@/components/FileUpload"
import { updateSalesperson } from "@/services/salesperson"
import { Salesperson, UpdateSalespersonRequest } from "@/types/salesperson"
import { UPLOAD_ENDPOINTS } from "@/services/upload"

interface SalespersonEditDialogProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
    salesperson: Salesperson | null
}

export function SalespersonEditDialog({ open, onClose, onSuccess, salesperson }: SalespersonEditDialogProps) {
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        email: "",
        address: "",
        selfie: "",
        aadharCardNumber: "",
        aadharCardFront: "",
        aadharCardBack: "",
        panCardNumber: "",
        panCardFront: "",
        bankAccountNumber: "",
        bankIfscCode: "",
        bankAccountName: "",
        cancelChequePhoto: "",
        status: "Active" as "Active" | "Inactive",
    })

    const [fieldErrors, setFieldErrors] = useState({
        name: "",
        phoneNumber: "",
        email: "",
        address: "",
        aadharCardNumber: "",
        panCardNumber: "",
        bankAccountNumber: "",
        bankIfscCode: "",
        bankAccountName: ""
    })

    // Set initial data when salesperson prop changes
    useEffect(() => {
        if (salesperson) {
            setFormData({
                name: salesperson.name || "",
                phoneNumber: salesperson.phoneNumber || "",
                email: salesperson.email || "",
                address: salesperson.address || "",
                selfie: salesperson.selfie || "",
                aadharCardNumber: salesperson.aadharCardNumber || "",
                aadharCardFront: salesperson.aadharCardFront || "",
                aadharCardBack: salesperson.aadharCardBack || "",
                panCardNumber: salesperson.panCardNumber || "",
                panCardFront: salesperson.panCardFront || "",
                bankAccountNumber: salesperson.bankAccountNumber || "",
                bankIfscCode: salesperson.bankIfscCode || "",
                bankAccountName: salesperson.bankAccountName || "",
                cancelChequePhoto: salesperson.cancelChequePhoto || "",
                status: salesperson.status || "Active",
            })
        }
    }, [salesperson])

    const resetForm = () => {
        setFormData({
            name: "",
            phoneNumber: "",
            email: "",
            address: "",
            selfie: "",
            aadharCardNumber: "",
            aadharCardFront: "",
            aadharCardBack: "",
            panCardNumber: "",
            panCardFront: "",
            bankAccountNumber: "",
            bankIfscCode: "",
            bankAccountName: "",
            cancelChequePhoto: "",
            status: "Active",
        })
        setFieldErrors({
            name: "",
            phoneNumber: "",
            email: "",
            address: "",
            aadharCardNumber: "",
            panCardNumber: "",
            bankAccountNumber: "",
            bankIfscCode: "",
            bankAccountName: ""
        })
    }

    const validateForm = () => {
        const errors = {
            name: "",
            phoneNumber: "",
            email: "",
            address: "",
            aadharCardNumber: "",
            panCardNumber: "",
            bankAccountNumber: "",
            bankIfscCode: "",
            bankAccountName: ""
        }

        if (!formData.name.trim()) {
            errors.name = "Name is required"
        }

        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = "Phone number is required"
        }

        // Optional email validation - only validate format if email is provided
        if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Please enter a valid email address"
        }

        // All other fields are optional - no validation needed

        setFieldErrors(errors)

        // Focus on first field with error
        const hasErrors = Object.values(errors).some(error => error !== "")
        if (hasErrors) {
            setTimeout(() => {
                if (errors.name) {
                    document.getElementById("edit-name")?.focus()
                } else if (errors.phoneNumber) {
                    document.getElementById("edit-phoneNumber")?.focus()
                } else if (errors.email) {
                    document.getElementById("edit-email")?.focus()
                }
            }, 100)
        }

        return !hasErrors
    }

    const handleSave = async () => {
        if (!salesperson) return

        if (!validateForm()) {
            return
        }

        setSaving(true)
        try {
            const updateData: UpdateSalespersonRequest = {
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                status: formData.status,
            }

            // Only add optional fields if they have values
            if (formData.email && formData.email.trim()) {
                updateData.email = formData.email.trim()
            }
            if (formData.address && formData.address.trim()) {
                updateData.address = formData.address.trim()
            }
            if (formData.aadharCardNumber && formData.aadharCardNumber.trim()) {
                updateData.aadharCardNumber = formData.aadharCardNumber.trim()
            }
            if (formData.panCardNumber && formData.panCardNumber.trim()) {
                updateData.panCardNumber = formData.panCardNumber.trim()
            }
            if (formData.bankAccountNumber && formData.bankAccountNumber.trim()) {
                updateData.bankAccountNumber = formData.bankAccountNumber.trim()
            }
            if (formData.bankIfscCode && formData.bankIfscCode.trim()) {
                updateData.bankIfscCode = formData.bankIfscCode.trim()
            }
            if (formData.bankAccountName && formData.bankAccountName.trim()) {
                updateData.bankAccountName = formData.bankAccountName.trim()
            }
            if (formData.selfie && formData.selfie.trim()) {
                updateData.selfie = formData.selfie.trim()
            }
            if (formData.aadharCardFront && formData.aadharCardFront.trim()) {
                updateData.aadharCardFront = formData.aadharCardFront.trim()
            }
            if (formData.aadharCardBack && formData.aadharCardBack.trim()) {
                updateData.aadharCardBack = formData.aadharCardBack.trim()
            }
            if (formData.panCardFront && formData.panCardFront.trim()) {
                updateData.panCardFront = formData.panCardFront.trim()
            }
            if (formData.cancelChequePhoto && formData.cancelChequePhoto.trim()) {
                updateData.cancelChequePhoto = formData.cancelChequePhoto.trim()
            }

            console.log('Updating salesperson data from UI:', updateData)

            await updateSalesperson(salesperson._id, updateData)
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Error updating salesperson:', error)
            alert(`Error updating salesperson: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setSaving(false)
        }
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    if (!salesperson) return null

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent side="right" className="w-[90vw] sm:w-[80vw] lg:w-[60vw] xl:w-[50vw] max-w-4xl overflow-y-auto rounded-2xl border border-border/40 bg-background text-foreground shadow-lg">
                <SheetHeader className="bg-background/70 backdrop-blur-md border-b border-border/40">
                    <SheetTitle className="text-xl font-semibold py-0">Edit Salesperson</SheetTitle>
                </SheetHeader>

                <div className="space-y-8 py-4 px-6">
                    {/* ---------- Basic Information ---------- */}
                    <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                        <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="edit-name" className="mb-2">Name *</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData((p) => ({ ...p, name: e.target.value }))
                                        if (fieldErrors.name) {
                                            setFieldErrors(prev => ({ ...prev, name: "" }))
                                        }
                                    }}
                                    placeholder="Enter salesperson name"
                                    disabled={saving}
                                    className={fieldErrors.name ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {fieldErrors.name && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.name}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="edit-phoneNumber" className="mb-2">Phone Number *</Label>
                                <Input
                                    id="edit-phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={(e) => {
                                        setFormData((p) => ({ ...p, phoneNumber: e.target.value }))
                                        if (fieldErrors.phoneNumber) {
                                            setFieldErrors(prev => ({ ...prev, phoneNumber: "" }))
                                        }
                                    }}
                                    placeholder="Enter phone number"
                                    disabled={saving}
                                    className={fieldErrors.phoneNumber ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {fieldErrors.phoneNumber && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.phoneNumber}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="edit-email" className="mb-2">Email</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData((p) => ({ ...p, email: e.target.value }))
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
                                <Label htmlFor="edit-status" className="mb-2">Status *</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value: "Active" | "Inactive") =>
                                        setFormData((p) => ({ ...p, status: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="edit-address" className="mb-2">Address</Label>
                                <Textarea
                                    id="edit-address"
                                    rows={3}
                                    value={formData.address}
                                    onChange={(e) => {
                                        setFormData((p) => ({ ...p, address: e.target.value }))
                                        if (fieldErrors.address) {
                                            setFieldErrors(prev => ({ ...prev, address: "" }))
                                        }
                                    }}
                                    placeholder="Enter complete address"
                                    disabled={saving}
                                    className={fieldErrors.address ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {fieldErrors.address && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.address}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <FileUpload
                                    label="Selfie"
                                    value={formData.selfie}
                                    onChange={(url) => setFormData((p) => ({ ...p, selfie: url }))}
                                    endpoint={UPLOAD_ENDPOINTS.SELFIE}
                                    disabled={saving}
                                />
                            </div>
                        </div>
                    </section>

                    {/* ---------- Identity Information ---------- */}
                    <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                        <h2 className="text-lg font-medium text-foreground/80 tracking-tight">
                            Identity Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="edit-aadharCardNumber" className="mb-2">Aadhaar Card Number</Label>
                                <Input
                                    id="edit-aadharCardNumber"
                                    value={formData.aadharCardNumber}
                                    onChange={(e) => {
                                        setFormData((p) => ({ ...p, aadharCardNumber: e.target.value }))
                                        if (fieldErrors.aadharCardNumber) {
                                            setFieldErrors(prev => ({ ...prev, aadharCardNumber: "" }))
                                        }
                                    }}
                                    placeholder="Enter Aadhaar card number"
                                    disabled={saving}
                                    className={fieldErrors.aadharCardNumber ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {fieldErrors.aadharCardNumber && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.aadharCardNumber}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="edit-panCardNumber" className="mb-2">PAN Card Number</Label>
                                <Input
                                    id="edit-panCardNumber"
                                    value={formData.panCardNumber}
                                    onChange={(e) => {
                                        setFormData((p) => ({ ...p, panCardNumber: e.target.value }))
                                        if (fieldErrors.panCardNumber) {
                                            setFieldErrors(prev => ({ ...prev, panCardNumber: "" }))
                                        }
                                    }}
                                    placeholder="Enter PAN card number"
                                    disabled={saving}
                                    className={fieldErrors.panCardNumber ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {fieldErrors.panCardNumber && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.panCardNumber}</p>
                                )}
                            </div>

                            <div>
                                <FileUpload
                                    label="Aadhaar Card Front"
                                    value={formData.aadharCardFront}
                                    onChange={(url) => setFormData((p) => ({ ...p, aadharCardFront: url }))}
                                    endpoint={UPLOAD_ENDPOINTS.AADHAR_FRONT}
                                    disabled={saving}
                                />
                            </div>

                            <div>
                                <FileUpload
                                    label="Aadhaar Card Back"
                                    value={formData.aadharCardBack}
                                    onChange={(url) => setFormData((p) => ({ ...p, aadharCardBack: url }))}
                                    endpoint={UPLOAD_ENDPOINTS.AADHAR_BACK}
                                    disabled={saving}
                                />
                            </div>

                            <div>
                                <FileUpload
                                    label="PAN Card Front"
                                    value={formData.panCardFront}
                                    onChange={(url) => setFormData((p) => ({ ...p, panCardFront: url }))}
                                    endpoint={UPLOAD_ENDPOINTS.PAN_FRONT}
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
                                <Label htmlFor="edit-bankAccountName" className="mb-2">Account Holder Name</Label>
                                <Input
                                    id="edit-bankAccountName"
                                    value={formData.bankAccountName}
                                    onChange={(e) => {
                                        setFormData((p) => ({ ...p, bankAccountName: e.target.value }))
                                        if (fieldErrors.bankAccountName) {
                                            setFieldErrors(prev => ({ ...prev, bankAccountName: "" }))
                                        }
                                    }}
                                    placeholder="Enter account holder name"
                                    disabled={saving}
                                    className={fieldErrors.bankAccountName ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {fieldErrors.bankAccountName && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.bankAccountName}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="edit-bankAccountNumber" className="mb-2">Account Number</Label>
                                <Input
                                    id="edit-bankAccountNumber"
                                    value={formData.bankAccountNumber}
                                    onChange={(e) => {
                                        setFormData((p) => ({ ...p, bankAccountNumber: e.target.value }))
                                        if (fieldErrors.bankAccountNumber) {
                                            setFieldErrors(prev => ({ ...prev, bankAccountNumber: "" }))
                                        }
                                    }}
                                    placeholder="Enter account number"
                                    disabled={saving}
                                    className={fieldErrors.bankAccountNumber ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {fieldErrors.bankAccountNumber && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.bankAccountNumber}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="edit-bankIfscCode" className="mb-2">IFSC Code</Label>
                                <Input
                                    id="edit-bankIfscCode"
                                    value={formData.bankIfscCode}
                                    onChange={(e) => {
                                        setFormData((p) => ({ ...p, bankIfscCode: e.target.value }))
                                        if (fieldErrors.bankIfscCode) {
                                            setFieldErrors(prev => ({ ...prev, bankIfscCode: "" }))
                                        }
                                    }}
                                    placeholder="Enter IFSC code"
                                    disabled={saving}
                                    className={fieldErrors.bankIfscCode ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {fieldErrors.bankIfscCode && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.bankIfscCode}</p>
                                )}
                            </div>

                            <div>
                                <FileUpload
                                    label="Cancel Cheque Photo"
                                    value={formData.cancelChequePhoto}
                                    onChange={(url) => setFormData((p) => ({ ...p, cancelChequePhoto: url }))}
                                    endpoint={UPLOAD_ENDPOINTS.CANCEL_CHEQUE}
                                    disabled={saving}
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <SheetFooter className="flex flex-row justify-end gap-3 border-t border-border/40 pt-4 sm:flex-row">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Updating..." : "Update Salesperson"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}