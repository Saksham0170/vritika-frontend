"use client"

import { useState } from "react"
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
import { createSubAdmin } from "@/services/sub-admin"
import { CreateSubAdminRequest } from "@/types/sub-admin"
import { useToast } from "@/hooks/use-toast"


interface SubAdminAddDialogProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

export function SubAdminAddDialog({ open, onClose, onSuccess }: SubAdminAddDialogProps) {
    const { toast } = useToast()
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
        password: "",
        gstNo: "",
        contactPersonName: "",
        address: "",
        aadharCardNo: "",
        panCardNo: "",
        bankAccountNo: "",
        ifscCode: "",
        bankHolderName: ""
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
            password: "",
            gstNo: "",
            contactPersonName: "",
            address: "",
            aadharCardNo: "",
            panCardNo: "",
            bankAccountNo: "",
            ifscCode: "",
            bankHolderName: ""
        })
    }

    const validateForm = () => {
        const errors = {
            name: "",
            phone: "",
            email: "",
            password: "",
            gstNo: "",
            contactPersonName: "",
            address: "",
            aadharCardNo: "",
            panCardNo: "",
            bankAccountNo: "",
            ifscCode: "",
            bankHolderName: ""
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

        // Only validate organisation fields if adminType is Organisation
        if (formData.adminType === "Organisation") {
            if (!formData.gstNo.trim()) {
                errors.gstNo = "GST Number is required for Organisation"
            }

            if (!formData.contactPersonName.trim()) {
                errors.contactPersonName = "Contact Person Name is required for Organisation"
            }
        }

        if (!formData.address.trim()) {
            errors.address = "Address is required"
        }

        if (!formData.aadharCardNo.trim()) {
            errors.aadharCardNo = "Aadhaar Card Number is required"
        }

        if (!formData.panCardNo.trim()) {
            errors.panCardNo = "PAN Card Number is required"
        }

        if (!formData.bankAccountNo.trim()) {
            errors.bankAccountNo = "Bank Account Number is required"
        }

        if (!formData.ifscCode.trim()) {
            errors.ifscCode = "IFSC Code is required"
        }

        if (!formData.bankHolderName.trim()) {
            errors.bankHolderName = "Bank Holder Name is required"
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
                } else if (errors.gstNo) {
                    document.getElementById("gstNo")?.focus()
                } else if (errors.contactPersonName) {
                    document.getElementById("contactPersonName")?.focus()
                } else if (errors.address) {
                    document.getElementById("address")?.focus()
                } else if (errors.aadharCardNo) {
                    document.getElementById("aadharCardNo")?.focus()
                } else if (errors.panCardNo) {
                    document.getElementById("panCardNo")?.focus()
                } else if (errors.bankAccountNo) {
                    document.getElementById("bankAccountNo")?.focus()
                } else if (errors.ifscCode) {
                    document.getElementById("ifscCode")?.focus()
                } else if (errors.bankHolderName) {
                    document.getElementById("bankHolderName")?.focus()
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
            const createData: CreateSubAdminRequest = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                adminType: formData.adminType,
                password: formData.password,
                address: formData.address,
                aadharCardNo: formData.aadharCardNo,
                panCardNo: formData.panCardNo,
                bankAccountNo: formData.bankAccountNo,
                ifscCode: formData.ifscCode,
                bankHolderName: formData.bankHolderName,
            }

            // Add organisation fields only for Organisation type
            if (formData.adminType === "Organisation") {
                createData.gstNo = formData.gstNo
                createData.contactPersonName = formData.contactPersonName
            }

            // Only add optional image fields if they have values
            if (formData.passbookImage && formData.passbookImage.trim()) {
                createData.passbookImage = formData.passbookImage.trim()
            }

            await createSubAdmin(createData)
            toast({
                title: "Success",
                description: "Sub-admin created successfully",
                variant: "success"
            })
            resetForm()
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Error creating sub-admin:', error)
            toast({
                title: "Error creating sub-admin",
                description: error instanceof Error ? error.message : 'Unknown error',
                variant: "destructive"
            })
        } finally {
            setSaving(false)
        }
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent side="right" className="w-[90vw] sm:w-[80vw] lg:w-[60vw] xl:w-[50vw] max-w-4xl overflow-y-auto rounded-2xl border border-border/40 bg-background text-foreground shadow-lg">
                <SheetHeader className="bg-background/70 backdrop-blur-md border-b border-border/40">
                    <SheetTitle className="text-xl font-semibold py-0 ">Add New Sub Admin</SheetTitle>
                </SheetHeader>

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
                                        setFormData((p) => ({ ...p, name: e.target.value }))
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
                                <Label htmlFor="address" className="mb-2">Address *</Label>
                                <Textarea
                                    id="address"
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
                                    <Label htmlFor="gstNo" className="mb-2">GST Number *</Label>
                                    <Input
                                        id="gstNo"
                                        value={formData.gstNo}
                                        onChange={(e) => {
                                            setFormData((p) => ({ ...p, gstNo: e.target.value }))
                                            if (fieldErrors.gstNo) {
                                                setFieldErrors(prev => ({ ...prev, gstNo: "" }))
                                            }
                                        }}
                                        placeholder="Enter GST number"
                                        disabled={saving}
                                        className={fieldErrors.gstNo ? "border-red-500 focus:border-red-500" : ""}
                                    />
                                    {fieldErrors.gstNo && (
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.gstNo}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="contactPersonName" className="mb-2">Contact Person Name *</Label>
                                    <Input
                                        id="contactPersonName"
                                        value={formData.contactPersonName}
                                        onChange={(e) => {
                                            setFormData((p) => ({ ...p, contactPersonName: e.target.value }))
                                            if (fieldErrors.contactPersonName) {
                                                setFieldErrors(prev => ({ ...prev, contactPersonName: "" }))
                                            }
                                        }}
                                        placeholder="Enter contact person name"
                                        disabled={saving}
                                        className={fieldErrors.contactPersonName ? "border-red-500 focus:border-red-500" : ""}
                                    />
                                    {fieldErrors.contactPersonName && (
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.contactPersonName}</p>
                                    )}
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
                                <Label htmlFor="aadharCardNo" className="mb-2">Aadhaar Card Number *</Label>
                                <Input
                                    id="aadharCardNo"
                                    value={formData.aadharCardNo}
                                    onChange={(e) => {
                                        setFormData((p) => ({ ...p, aadharCardNo: e.target.value }))
                                        if (fieldErrors.aadharCardNo) {
                                            setFieldErrors(prev => ({ ...prev, aadharCardNo: "" }))
                                        }
                                    }}
                                    placeholder="Enter Aadhaar card number"
                                    disabled={saving}
                                    className={fieldErrors.aadharCardNo ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {fieldErrors.aadharCardNo && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.aadharCardNo}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="panCardNo" className="mb-2">PAN Card Number *</Label>
                                <Input
                                    id="panCardNo"
                                    value={formData.panCardNo}
                                    onChange={(e) => {
                                        setFormData((p) => ({ ...p, panCardNo: e.target.value }))
                                        if (fieldErrors.panCardNo) {
                                            setFieldErrors(prev => ({ ...prev, panCardNo: "" }))
                                        }
                                    }}
                                    placeholder="Enter PAN card number"
                                    disabled={saving}
                                    className={fieldErrors.panCardNo ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {fieldErrors.panCardNo && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.panCardNo}</p>
                                )}
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
                                <Label htmlFor="bankHolderName" className="mb-2">Account Holder Name *</Label>
                                <Input
                                    id="bankHolderName"
                                    value={formData.bankHolderName}
                                    onChange={(e) => {
                                        setFormData((p) => ({ ...p, bankHolderName: e.target.value }))
                                        if (fieldErrors.bankHolderName) {
                                            setFieldErrors(prev => ({ ...prev, bankHolderName: "" }))
                                        }
                                    }}
                                    placeholder="Enter account holder name"
                                    disabled={saving}
                                    className={fieldErrors.bankHolderName ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {fieldErrors.bankHolderName && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.bankHolderName}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="bankAccountNo" className="mb-2">Account Number *</Label>
                                <Input
                                    id="bankAccountNo"
                                    value={formData.bankAccountNo}
                                    onChange={(e) => {
                                        setFormData((p) => ({ ...p, bankAccountNo: e.target.value }))
                                        if (fieldErrors.bankAccountNo) {
                                            setFieldErrors(prev => ({ ...prev, bankAccountNo: "" }))
                                        }
                                    }}
                                    placeholder="Enter account number"
                                    disabled={saving}
                                    className={fieldErrors.bankAccountNo ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {fieldErrors.bankAccountNo && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.bankAccountNo}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="ifscCode" className="mb-2">IFSC Code *</Label>
                                <Input
                                    id="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={(e) => {
                                        setFormData((p) => ({ ...p, ifscCode: e.target.value }))
                                        if (fieldErrors.ifscCode) {
                                            setFieldErrors(prev => ({ ...prev, ifscCode: "" }))
                                        }
                                    }}
                                    placeholder="Enter IFSC code"
                                    disabled={saving}
                                    className={fieldErrors.ifscCode ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {fieldErrors.ifscCode && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.ifscCode}</p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                <SheetFooter className="flex flex-row justify-end gap-3 border-t border-border/40 pt-4 sm:flex-row">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Creating..." : "Create Sub Admin"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}