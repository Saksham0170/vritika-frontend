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
import { getAdminById, updateAdmin } from "@/services/admin"
import { Admin, UpdateAdminRequest } from "@/types/admin"
import { useToast } from "@/hooks/use-toast"


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
        aadharCardImage: ["", ""] as string[], // Front and Back URLs
        panCardNo: "",
        panCardImage: ["", ""] as string[], // Front and Back URLs
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
        if (adminId && open) {
            setLoading(true)
            setError(null)
            setFieldErrors({
                name: "",
                phone: "",
                email: ""
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
                        aadharCardImage: [
                            adminData.aadharCardImage?.[0] || "",
                            adminData.aadharCardImage?.[1] || ""
                        ],
                        panCardNo: adminData.panCardNo || "",
                        panCardImage: [
                            adminData.panCardImage?.[0] || "",
                            adminData.panCardImage?.[1] || ""
                        ],
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

    // URL input handling functions
    const handleImageUrlChange = (field: 'aadharCardImage' | 'panCardImage', index: number, url: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? url : item)
        }))
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
            const aadharImages = formData.aadharCardImage.filter(url => url.trim() !== '')
            const currentAadharImages = (admin.aadharCardImage || []).filter(url => url.trim() !== '')
            if (JSON.stringify(aadharImages) !== JSON.stringify(currentAadharImages)) updateData.aadharCardImage = aadharImages
            if (formData.panCardNo !== admin.panCardNo) updateData.panCardNo = formData.panCardNo
            const panImages = formData.panCardImage.filter(url => url.trim() !== '')
            const currentPanImages = (admin.panCardImage || []).filter(url => url.trim() !== '')
            if (JSON.stringify(panImages) !== JSON.stringify(currentPanImages)) updateData.panCardImage = panImages
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
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                        placeholder="Enter complete address"
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
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="contactPersonName" className="mb-2">Contact Person Name</Label>
                                        <Input
                                            id="contactPersonName"
                                            value={formData.contactPersonName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, contactPersonName: e.target.value }))}
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
                                        onChange={(e) => setFormData(prev => ({ ...prev, aadharCardNo: e.target.value }))}
                                        placeholder="Enter Aadhaar card number"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="panCardNo" className="mb-2">PAN Card Number</Label>
                                    <Input
                                        id="panCardNo"
                                        value={formData.panCardNo}
                                        onChange={(e) => setFormData(prev => ({ ...prev, panCardNo: e.target.value }))}
                                        placeholder="Enter PAN card number"
                                    />
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
                                    <Label htmlFor="bankHolderName" className="mb-2">Account Holder Name</Label>
                                    <Input
                                        id="bankHolderName"
                                        value={formData.bankHolderName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, bankHolderName: e.target.value }))}
                                        placeholder="Enter account holder name"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="bankAccountNo" className="mb-2">Account Number</Label>
                                    <Input
                                        id="bankAccountNo"
                                        value={formData.bankAccountNo}
                                        onChange={(e) => setFormData(prev => ({ ...prev, bankAccountNo: e.target.value }))}
                                        placeholder="Enter account number"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="ifscCode" className="mb-2">IFSC Code</Label>
                                    <Input
                                        id="ifscCode"
                                        value={formData.ifscCode}
                                        onChange={(e) => setFormData(prev => ({ ...prev, ifscCode: e.target.value }))}
                                        placeholder="Enter IFSC code"
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