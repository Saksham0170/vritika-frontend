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
import { createAdmin } from "@/services/admin"
import { CreateAdminRequest } from "@/types/admin"
import { useToast } from "@/hooks/use-toast"
import { adminFormSchema, type AdminFormData } from "@/lib/validators"
import { z } from "zod"


interface AdminAddDialogProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

export function AdminAddDialog({ open, onClose, onSuccess }: AdminAddDialogProps) {
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
        aadharCardImage: ["", ""] as string[], // Front and Back URLs
        panCardNo: "",
        panCardImage: ["", ""] as string[], // Front and Back URLs
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
            aadharCardImage: ["", ""],
            panCardNo: "",
            panCardImage: ["", ""],
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
        try {
            // Validate using Zod schema
            adminFormSchema.parse({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                adminType: formData.adminType,
                gstNo: formData.gstNo || undefined,
                contactPersonName: formData.contactPersonName || undefined,
                address: formData.address,
                aadharCardNo: formData.aadharCardNo,
                panCardNo: formData.panCardNo,
                bankAccountNo: formData.bankAccountNo,
                ifscCode: formData.ifscCode,
                bankHolderName: formData.bankHolderName,
            })

            // Clear errors if validation passes
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
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
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

                error.issues.forEach((issue) => {
                    const field = issue.path[0] as keyof typeof errors
                    if (field in errors) {
                        errors[field] = issue.message
                    }
                })

                setFieldErrors(errors)

                // Focus on first field with error
                setTimeout(() => {
                    const firstErrorField = error.issues[0]?.path[0] as string
                    document.getElementById(firstErrorField)?.focus()
                }, 100)
            }
            return false
        }
    }

    // URL input handling functions
    const handleImageUrlChange = (field: 'aadharCardImage' | 'panCardImage', index: number, url: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? url : item)
        }))
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
            const aadharImages = formData.aadharCardImage.filter(url => url.trim() !== '')
            if (aadharImages.length > 0) createData.aadharCardImage = aadharImages
            if (formData.panCardNo) createData.panCardNo = formData.panCardNo
            const panImages = formData.panCardImage.filter(url => url.trim() !== '')
            if (panImages.length > 0) createData.panCardImage = panImages
            if (formData.bankAccountNo) createData.bankAccountNo = formData.bankAccountNo
            if (formData.ifscCode) createData.ifscCode = formData.ifscCode
            if (formData.bankHolderName) createData.bankHolderName = formData.bankHolderName
            if (formData.passbookImage) createData.passbookImage = formData.passbookImage

            await createAdmin(createData)
            toast({
                title: "Admin Created",
                description: "New admin has been successfully added to the system.",
                variant: "success"
            })
            resetForm()
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Error creating admin:', error)
            toast({
                title: "Failed to Create Admin",
                description: error instanceof Error ? error.message : 'Something went wrong while creating the admin. Please check your information and try again.',
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
                    <SheetTitle className="text-xl font-semibold py-0 ">Add New Admin</SheetTitle>
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
                                    placeholder="Enter complete address (minimum 10 characters)"
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
                                    <Label htmlFor="gstNo" className="mb-2">GST Number</Label>
                                    <Input
                                        id="gstNo"
                                        value={formData.gstNo}
                                        onChange={(e) => {
                                            setFormData((p) => ({ ...p, gstNo: e.target.value }))
                                            if (fieldErrors.gstNo) {
                                                setFieldErrors(prev => ({ ...prev, gstNo: "" }))
                                            }
                                        }}
                                        placeholder="Enter GST number (e.g., 27ABCDE1234F1Z5)"
                                        disabled={saving}
                                        className={fieldErrors.gstNo ? "border-red-500 focus:border-red-500" : ""}
                                    />
                                    {fieldErrors.gstNo && (
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.gstNo}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="contactPersonName" className="mb-2">Contact Person Name</Label>
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
                                    placeholder="Enter 12-digit Aadhaar number"
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
                                        setFormData((p) => ({ ...p, panCardNo: e.target.value.toUpperCase() }))
                                        if (fieldErrors.panCardNo) {
                                            setFieldErrors(prev => ({ ...prev, panCardNo: "" }))
                                        }
                                    }}
                                    placeholder="Enter PAN number (e.g., ABCDE1234F)"
                                    disabled={saving}
                                    className={fieldErrors.panCardNo ? "border-red-500 focus:border-red-500" : ""}
                                />
                                {fieldErrors.panCardNo && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.panCardNo}</p>
                                )}
                            </div>

                            {/* Aadhaar Card Images */}
                            <div className="md:col-span-2">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="aadharFront" className="mb-2">Aadhaar Front Side</Label>
                                            <Input
                                                id="aadharFront"
                                                value={formData.aadharCardImage[0]}
                                                onChange={(e) => handleImageUrlChange('aadharCardImage', 0, e.target.value)}
                                                placeholder="Enter Aadhaar front image URL"
                                            />
                                            {formData.aadharCardImage[0] && (
                                                <div className="mt-2">
                                                    <img
                                                        src={formData.aadharCardImage[0]}
                                                        alt="Aadhaar Front"
                                                        className="w-32 h-20 object-cover rounded border"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none'
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="aadharBack" className="mb-2">Aadhaar Back Side</Label>
                                            <Input
                                                id="aadharBack"
                                                value={formData.aadharCardImage[1]}
                                                onChange={(e) => handleImageUrlChange('aadharCardImage', 1, e.target.value)}
                                                placeholder="Enter Aadhaar back image URL"
                                            />
                                            {formData.aadharCardImage[1] && (
                                                <div className="mt-2">
                                                    <img
                                                        src={formData.aadharCardImage[1]}
                                                        alt="Aadhaar Back"
                                                        className="w-32 h-20 object-cover rounded border"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none'
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PAN Card Images */}
                            <div className="md:col-span-2">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="panFront" className="mb-2">Pan Front Side</Label>
                                            <Input
                                                id="panFront"
                                                value={formData.panCardImage[0]}
                                                onChange={(e) => handleImageUrlChange('panCardImage', 0, e.target.value)}
                                                placeholder="Enter PAN front image URL"
                                            />
                                            {formData.panCardImage[0] && (
                                                <div className="mt-2">
                                                    <img
                                                        src={formData.panCardImage[0]}
                                                        alt="PAN Front"
                                                        className="w-32 h-20 object-cover rounded border"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none'
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="panBack" className="mb-2">Pan Back Side</Label>
                                            <Input
                                                id="panBack"
                                                value={formData.panCardImage[1]}
                                                onChange={(e) => handleImageUrlChange('panCardImage', 1, e.target.value)}
                                                placeholder="Enter PAN back image URL"
                                            />
                                            {formData.panCardImage[1] && (
                                                <div className="mt-2">
                                                    <img
                                                        src={formData.panCardImage[1]}
                                                        alt="PAN Back"
                                                        className="w-32 h-20 object-cover rounded border"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none'
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
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
                                    placeholder="Enter 9-18 digit account number"
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
                                        setFormData((p) => ({ ...p, ifscCode: e.target.value.toUpperCase() }))
                                        if (fieldErrors.ifscCode) {
                                            setFieldErrors(prev => ({ ...prev, ifscCode: "" }))
                                        }
                                    }}
                                    placeholder="Enter IFSC code (e.g., SBIN0001234)"
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
                        {saving ? "Creating..." : "Create Admin"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}