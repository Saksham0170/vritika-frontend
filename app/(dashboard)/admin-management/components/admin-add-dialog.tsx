"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
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
import { createAdmin } from "@/services/admin"
import { CreateAdminRequest } from "@/types/admin"


interface AdminAddDialogProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

export function AdminAddDialog({ open, onClose, onSuccess }: AdminAddDialogProps) {
    const [saving, setSaving] = useState(false)

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
        passbookImage: "",
        password: "",
    })

    const [fieldErrors, setFieldErrors] = useState({
        name: "",
        phone: "",
        email: "",
        password: ""
    })

    const resetForm = () => {
        setFormData({
            name: "",
            phone: "",
            email: "",
            adminType: "Individual",
            gstNo: "",
            contactPersonName: "",
            address: "",
            aadharCardNo: "",
            panCardNo: "",
            bankAccountNo: "",
            ifscCode: "",
            bankHolderName: "",
            passbookImage: "",
            password: "",
        })
        setFieldErrors({
            name: "",
            phone: "",
            email: "",
            password: ""
        })
    }

    const validateForm = () => {
        const errors = {
            name: "",
            phone: "",
            email: "",
            password: ""
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

        if (!formData.password.trim()) {
            errors.password = "Password is required"
        } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters"
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
                } else if (errors.password) {
                    document.getElementById("password")?.focus()
                }
            }, 100)
        }

        return !hasErrors
    }

    const handleSave = async () => {
        if (!validateForm()) {
            return
        }

        setSaving(true)
        try {
            const createData: CreateAdminRequest = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                adminType: formData.adminType,
                password: formData.password,
            }

            if (formData.gstNo) createData.gstNo = formData.gstNo
            if (formData.contactPersonName) createData.contactPersonName = formData.contactPersonName
            if (formData.address) createData.address = formData.address
            if (formData.aadharCardNo) createData.aadharCardNo = formData.aadharCardNo
            if (formData.panCardNo) createData.panCardNo = formData.panCardNo
            if (formData.bankAccountNo) createData.bankAccountNo = formData.bankAccountNo
            if (formData.ifscCode) createData.ifscCode = formData.ifscCode
            if (formData.bankHolderName) createData.bankHolderName = formData.bankHolderName
            if (formData.passbookImage) createData.passbookImage = formData.passbookImage

            await createAdmin(createData)
            resetForm()
            onSuccess?.()
            onClose()
        } catch {
            // Handle error silently
        } finally {
            setSaving(false)
        }
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/40 bg-background text-foreground shadow-lg">
                <DialogHeader className="bg-background/70 backdrop-blur-md border-b border-border/40">
                    <DialogTitle className="text-xl font-semibold py-0 ">Add New Admin</DialogTitle>
                </DialogHeader>

                <div className="space-y-8 py-4">
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
                                        setFormData((p) => ({ ...p, name: e.target.value }))
                                        if (fieldErrors.name) {
                                            setFieldErrors(prev => ({ ...prev, name: "" }))
                                        }
                                    }}
                                    placeholder="Enter admin name"
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
                                        setFormData((p) => ({ ...p, adminType: value }))
                                    }
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
                                <Label htmlFor="phone" className="mb-2">Phone *</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        setFormData((p) => ({ ...p, phone: e.target.value }))
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
                                    onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                                    placeholder="Enter complete address"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="password" className="mb-2">Password *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => {
                                        setFormData((p) => ({ ...p, password: e.target.value }))
                                        if (fieldErrors.password) {
                                            setFieldErrors(prev => ({ ...prev, password: "" }))
                                        }
                                    }}
                                    placeholder="Enter password"
                                    disabled={saving}
                                    className={fieldErrors.password ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {fieldErrors.password && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.password}</p>
                                )}
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
                                        onChange={(e) => setFormData((p) => ({ ...p, gstNo: e.target.value }))}
                                        placeholder="Enter GST number"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="contactPersonName" className="mb-2">Contact Person Name</Label>
                                    <Input
                                        id="contactPersonName"
                                        value={formData.contactPersonName}
                                        onChange={(e) => setFormData((p) => ({ ...p, contactPersonName: e.target.value }))}
                                        placeholder="Enter contact person name"
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
                                    onChange={(e) => setFormData((p) => ({ ...p, aadharCardNo: e.target.value }))}
                                    placeholder="Enter Aadhaar card number"
                                />
                            </div>
                            <div>
                                <Label htmlFor="panCardNo" className="mb-2">PAN Card Number</Label>
                                <Input
                                    id="panCardNo"
                                    value={formData.panCardNo}
                                    onChange={(e) => setFormData((p) => ({ ...p, panCardNo: e.target.value }))}
                                    placeholder="Enter PAN card number"
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
                                    onChange={(e) => setFormData((p) => ({ ...p, bankHolderName: e.target.value }))}
                                    placeholder="Enter account holder name"
                                />
                            </div>

                            <div>
                                <Label htmlFor="bankAccountNo" className="mb-2">Account Number</Label>
                                <Input
                                    id="bankAccountNo"
                                    value={formData.bankAccountNo}
                                    onChange={(e) => setFormData((p) => ({ ...p, bankAccountNo: e.target.value }))}
                                    placeholder="Enter account number"
                                />
                            </div>

                            <div>
                                <Label htmlFor="ifscCode" className="mb-2">IFSC Code</Label>
                                <Input
                                    id="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={(e) => setFormData((p) => ({ ...p, ifscCode: e.target.value }))}
                                    placeholder="Enter IFSC code"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <DialogFooter className="flex justify-end gap-3 border-t border-border/40 pt-4">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Creating..." : "Create Admin"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}