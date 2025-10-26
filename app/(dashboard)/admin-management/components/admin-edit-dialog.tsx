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
import { FileUpload } from "@/components/FileUpload"
import { getAdminById, updateAdmin } from "@/services/admin"
import { Admin, UpdateAdminRequest } from "@/types/admin"
import { useToast } from "@/hooks/use-toast"
import { adminFormSchema } from "@/lib/validators"
import { UPLOAD_ENDPOINTS } from "@/services/upload"
import { z } from "zod"


interface AdminEditDialogProps {
    adminId: string | null
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

export function AdminEditDialog({ adminId, open, onClose, onSuccess }: AdminEditDialogProps) {
    const { toast } = useToast()
    const [admin, setAdmin] = useState<Admin | null>(null)
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
        aadharCardFront: "",
        aadharCardBack: "",
        panCardNo: "",
        panCardFront: "",
        panCardBack: "",
        bankAccountNo: "",
        ifscCode: "",
        bankHolderName: "",
        passbookImage: ""
    })

    const [fieldErrors, setFieldErrors] = useState({
        name: "",
        phone: "",
        email: "",
        gstNo: "",
        contactPersonName: "",
        address: "",
        aadharCardNo: "",
        panCardNo: "",
        bankAccountNo: "",
        ifscCode: "",
        bankHolderName: ""
    })

    useEffect(() => {
        if (adminId && open) {
            setLoading(true)
            setError(null)
            setFieldErrors({
                name: "",
                phone: "",
                email: "",
                gstNo: "",
                contactPersonName: "",
                address: "",
                aadharCardNo: "",
                panCardNo: "",
                bankAccountNo: "",
                ifscCode: "",
                bankHolderName: ""
            })
            getAdminById(adminId)
                .then((adminData) => {
                    setAdmin(adminData)
                    setFormData({
                        name: adminData.name || "",
                        phone: adminData.phone || "",
                        email: adminData.email || "",
                        adminType: adminData.adminType || "Individual",
                        gstNo: adminData.gstNo || "",
                        contactPersonName: adminData.contactPersonName || "",
                        address: adminData.address || "",
                        aadharCardNo: adminData.aadharCardNo || "",
                        aadharCardFront: adminData.aadharCardImage?.[0] || "",
                        aadharCardBack: adminData.aadharCardImage?.[1] || "",
                        panCardNo: adminData.panCardNo || "",
                        panCardFront: adminData.panCardImage?.[0] || "",
                        panCardBack: adminData.panCardImage?.[1] || "",
                        bankAccountNo: adminData.bankAccountNo || "",
                        ifscCode: adminData.ifscCode || "",
                        bankHolderName: adminData.bankHolderName || "",
                        passbookImage: adminData.passbookImage || ""
                    })
                })
                .catch((err: unknown) => {
                    const errorMessage = err instanceof Error ? err.message : "Failed to load admin"
                    setError(errorMessage)
                    toast({
                        title: "Error",
                        description: "Failed to load admin details. Please try again.",
                        variant: "destructive"
                    })
                })
                .finally(() => setLoading(false))
        }
    }, [adminId, open])

    const validateForm = () => {
        try {
            // Create edit schema - password is not required for edit
            const editAdminSchema = adminFormSchema.omit({ password: true })

            // Validate using Zod schema
            editAdminSchema.parse({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
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



    const handleSave = async () => {
        if (!adminId || !admin) return

        if (!validateForm()) {
            return
        }

        setSaving(true)
        try {
            const updateData: UpdateAdminRequest = {}

            // Only include fields that have changed
            if (formData.name !== admin.name) updateData.name = formData.name
            if (formData.phone !== admin.phone) updateData.phone = formData.phone
            if (formData.email !== admin.email) updateData.email = formData.email
            if (formData.adminType !== admin.adminType) updateData.adminType = formData.adminType
            if (formData.gstNo !== admin.gstNo) updateData.gstNo = formData.gstNo
            if (formData.contactPersonName !== admin.contactPersonName) updateData.contactPersonName = formData.contactPersonName
            if (formData.address !== admin.address) updateData.address = formData.address
            if (formData.aadharCardNo !== admin.aadharCardNo) updateData.aadharCardNo = formData.aadharCardNo

            // Handle Aadhaar images
            const aadharImages: string[] = []
            if (formData.aadharCardFront?.trim()) aadharImages.push(formData.aadharCardFront.trim())
            if (formData.aadharCardBack?.trim()) aadharImages.push(formData.aadharCardBack.trim())
            const currentAadharImages = (admin.aadharCardImage || []).filter(url => url.trim() !== '')
            if (JSON.stringify(aadharImages) !== JSON.stringify(currentAadharImages)) {
                updateData.aadharCardImage = aadharImages
            }

            if (formData.panCardNo !== admin.panCardNo) updateData.panCardNo = formData.panCardNo

            // Handle PAN images
            const panImages: string[] = []
            if (formData.panCardFront?.trim()) panImages.push(formData.panCardFront.trim())
            if (formData.panCardBack?.trim()) panImages.push(formData.panCardBack.trim())
            const currentPanImages = (admin.panCardImage || []).filter(url => url.trim() !== '')
            if (JSON.stringify(panImages) !== JSON.stringify(currentPanImages)) {
                updateData.panCardImage = panImages
            }
            if (formData.bankAccountNo !== admin.bankAccountNo) updateData.bankAccountNo = formData.bankAccountNo
            if (formData.ifscCode !== admin.ifscCode) updateData.ifscCode = formData.ifscCode
            if (formData.bankHolderName !== admin.bankHolderName) updateData.bankHolderName = formData.bankHolderName
            if (formData.passbookImage !== admin.passbookImage) updateData.passbookImage = formData.passbookImage

            await updateAdmin(adminId, updateData)
            toast({
                title: "Success",
                description: "Admin updated successfully"
            })
            onSuccess?.()
            onClose()
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update admin. Please try again.",
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
                    <SheetTitle className="text-xl font-semibold py-0">Edit Admin</SheetTitle>
                </SheetHeader>

                {loading && <LoadingSpinner message="Loading admin..." />}

                {error && (
                    <div className="text-red-600 text-center py-4">{error}</div>
                )}

                {admin && !loading && !error && (
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
                                    <Select value={formData.adminType} onValueChange={(value: "Organisation" | "Individual") => setFormData(prev => ({ ...prev, adminType: value }))}>
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
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                            setFormData(prev => ({ ...prev, address: e.target.value }))
                                            if (fieldErrors.address) {
                                                setFieldErrors(prev => ({ ...prev, address: "" }))
                                            }
                                        }}
                                        placeholder="Enter complete address"
                                        className={fieldErrors.address ? "border-red-500 focus:border-red-500" : ""}
                                        disabled={saving}
                                    />
                                    {fieldErrors.address && (
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.address}</p>
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
                                                setFormData(prev => ({ ...prev, gstNo: e.target.value }))
                                                if (fieldErrors.gstNo) {
                                                    setFieldErrors(prev => ({ ...prev, gstNo: "" }))
                                                }
                                            }}
                                            placeholder="Enter GST number"
                                            className={fieldErrors.gstNo ? "border-red-500 focus:border-red-500" : ""}
                                            disabled={saving}
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
                                                setFormData(prev => ({ ...prev, contactPersonName: e.target.value }))
                                                if (fieldErrors.contactPersonName) {
                                                    setFieldErrors(prev => ({ ...prev, contactPersonName: "" }))
                                                }
                                            }}
                                            placeholder="Enter contact person name"
                                            className={fieldErrors.contactPersonName ? "border-red-500 focus:border-red-500" : ""}
                                            disabled={saving}
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
                                    <Label htmlFor="aadharCardNo" className="mb-2">Aadhaar Card Number</Label>
                                    <Input
                                        id="aadharCardNo"
                                        value={formData.aadharCardNo}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, aadharCardNo: e.target.value }))
                                            if (fieldErrors.aadharCardNo) {
                                                setFieldErrors(prev => ({ ...prev, aadharCardNo: "" }))
                                            }
                                        }}
                                        placeholder="Enter Aadhaar card number"
                                        className={fieldErrors.aadharCardNo ? "border-red-500 focus:border-red-500" : ""}
                                        disabled={saving}
                                    />
                                    {fieldErrors.aadharCardNo && (
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.aadharCardNo}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="panCardNo" className="mb-2">PAN Card Number</Label>
                                    <Input
                                        id="panCardNo"
                                        value={formData.panCardNo}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, panCardNo: e.target.value }))
                                            if (fieldErrors.panCardNo) {
                                                setFieldErrors(prev => ({ ...prev, panCardNo: "" }))
                                            }
                                        }}
                                        placeholder="Enter PAN card number"
                                        className={fieldErrors.panCardNo ? "border-red-500 focus:border-red-500" : ""}
                                        disabled={saving}
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
                                                <FileUpload
                                                    label="Aadhaar Card Front"
                                                    value={formData.aadharCardFront}
                                                    onChange={(url) => setFormData(prev => ({ ...prev, aadharCardFront: url }))}
                                                    endpoint={UPLOAD_ENDPOINTS.ADMIN_AADHAR_FRONT}
                                                    disabled={saving}
                                                />
                                            </div>
                                            <div>
                                                <FileUpload
                                                    label="Aadhaar Card Back"
                                                    value={formData.aadharCardBack}
                                                    onChange={(url) => setFormData(prev => ({ ...prev, aadharCardBack: url }))}
                                                    endpoint={UPLOAD_ENDPOINTS.ADMIN_AADHAR_BACK}
                                                    disabled={saving}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* PAN Card Images */}
                                <div className="md:col-span-2">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <FileUpload
                                                    label="PAN Card Front"
                                                    value={formData.panCardFront}
                                                    onChange={(url) => setFormData(prev => ({ ...prev, panCardFront: url }))}
                                                    endpoint={UPLOAD_ENDPOINTS.ADMIN_PAN_FRONT}
                                                    disabled={saving}
                                                />
                                            </div>
                                            <div>
                                                <FileUpload
                                                    label="PAN Card Back"
                                                    value={formData.panCardBack}
                                                    onChange={(url) => setFormData(prev => ({ ...prev, panCardBack: url }))}
                                                    endpoint={UPLOAD_ENDPOINTS.ADMIN_PAN_BACK}
                                                    disabled={saving}
                                                />
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
                                    <Label htmlFor="bankHolderName" className="mb-2">Account Holder Name</Label>
                                    <Input
                                        id="bankHolderName"
                                        value={formData.bankHolderName}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, bankHolderName: e.target.value }))
                                            if (fieldErrors.bankHolderName) {
                                                setFieldErrors(prev => ({ ...prev, bankHolderName: "" }))
                                            }
                                        }}
                                        placeholder="Enter account holder name"
                                        className={fieldErrors.bankHolderName ? "border-red-500 focus:border-red-500" : ""}
                                        disabled={saving}
                                    />
                                    {fieldErrors.bankHolderName && (
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.bankHolderName}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="bankAccountNo" className="mb-2">Account Number</Label>
                                    <Input
                                        id="bankAccountNo"
                                        value={formData.bankAccountNo}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, bankAccountNo: e.target.value }))
                                            if (fieldErrors.bankAccountNo) {
                                                setFieldErrors(prev => ({ ...prev, bankAccountNo: "" }))
                                            }
                                        }}
                                        placeholder="Enter account number"
                                        className={fieldErrors.bankAccountNo ? "border-red-500 focus:border-red-500" : ""}
                                        disabled={saving}
                                    />
                                    {fieldErrors.bankAccountNo && (
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.bankAccountNo}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="ifscCode" className="mb-2">IFSC Code</Label>
                                    <Input
                                        id="ifscCode"
                                        value={formData.ifscCode}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, ifscCode: e.target.value }))
                                            if (fieldErrors.ifscCode) {
                                                setFieldErrors(prev => ({ ...prev, ifscCode: "" }))
                                            }
                                        }}
                                        placeholder="Enter IFSC code"
                                        className={fieldErrors.ifscCode ? "border-red-500 focus:border-red-500" : ""}
                                        disabled={saving}
                                    />
                                    {fieldErrors.ifscCode && (
                                        <p className="text-sm text-red-500 mt-1">{fieldErrors.ifscCode}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <FileUpload
                                        label="Bank Passbook/Statement"
                                        value={formData.passbookImage}
                                        onChange={(url) => setFormData(prev => ({ ...prev, passbookImage: url }))}
                                        endpoint={UPLOAD_ENDPOINTS.ADMIN_PASSBOOK}
                                        disabled={saving}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                <SheetFooter className="flex flex-row justify-end gap-3 border-t border-border/40 pt-4 sm:flex-row">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving || loading}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}