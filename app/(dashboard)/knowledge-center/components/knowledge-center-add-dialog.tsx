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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PdfUpload } from "@/components/PdfUpload"
import { createKnowledgeCenter } from "@/services/knowledge-center"
import { CreateKnowledgeCenterRequest } from "@/types/knowledge-center"
import { UPLOAD_ENDPOINTS } from "@/services/upload"
import { useToast } from "@/hooks/use-toast"

interface KnowledgeCenterAddDialogProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

export function KnowledgeCenterAddDialog({ open, onClose, onSuccess }: KnowledgeCenterAddDialogProps) {
    const { toast } = useToast()
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        type: "video" as "video" | "pdf",
        url: "",
        status: true,
    })

    const [fieldErrors, setFieldErrors] = useState({
        url: "",
    })

    const resetForm = () => {
        setFormData({
            type: "video",
            url: "",
            status: true,
        })
        setFieldErrors({
            url: "",
        })
    }

    const validateForm = () => {
        const errors = {
            url: "",
        }

        if (!formData.url || formData.url.trim() === "") {
            errors.url = "URL is required"
        } else if (formData.type === "video") {
            // Basic URL validation for videos
            if (!formData.url.includes("youtube.com") && !formData.url.includes("youtu.be") && !formData.url.match(/^https?:\/\/.+/)) {
                errors.url = "Please enter a valid video URL"
            }
        } else if (formData.type === "pdf") {
            // For PDF, it should be a proper URL after upload
            if (!formData.url.match(/^https?:\/\/.+/)) {
                errors.url = "Please upload a valid PDF file"
            }
        }

        setFieldErrors(errors)
        return !errors.url
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            setSaving(true)

            const requestData: CreateKnowledgeCenterRequest = {
                type: formData.type,
                url: formData.url,
                status: formData.status,
            }

            await createKnowledgeCenter(requestData)

            toast({
                title: "Success",
                description: "Knowledge center entry created successfully",
            })

            resetForm()
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error("Error creating knowledge center entry:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create knowledge center entry",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleClose = () => {
        if (!saving) {
            resetForm()
            onClose()
        }
    }

    const handleFileUploadSuccess = (url: string) => {
        setFormData(prev => ({ ...prev, url }))
        setFieldErrors(prev => ({ ...prev, url: "" }))
    }

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent side="right" className="w-[80vw] sm:w-[70vw] lg:w-[50vw] xl:w-[40vw] max-w-2xl overflow-y-auto rounded-2xl border border-border/40 bg-background text-foreground shadow-lg">
                <SheetHeader className="bg-background/70 backdrop-blur-md border-b border-border/40">
                    <SheetTitle className="text-xl font-semibold py-0">Add Knowledge Center Entry</SheetTitle>
                </SheetHeader>

                <div className="py-4 px-6">
                    <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {/* Type and Status in same row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="type" className="mb-2">
                                            Type <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(value: "video" | "pdf") => {
                                                setFormData({ ...formData, type: value, url: "" })
                                                setFieldErrors({ url: "" })
                                            }}
                                            disabled={saving}
                                        >
                                            <SelectTrigger id="type">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="video">Video</SelectItem>
                                                <SelectItem value="pdf">PDF</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status" className="mb-2">
                                            Status <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={formData.status ? "true" : "false"}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, status: value === "true" })
                                            }
                                            disabled={saving}
                                        >
                                            <SelectTrigger id="status">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="true">Active</SelectItem>
                                                <SelectItem value="false">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* URL or File Upload in next row */}
                                {formData.type === "video" ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="url" className="mb-2">
                                            Video URL <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="url"
                                            type="url"
                                            placeholder="Video Link"
                                            value={formData.url}
                                            onChange={(e) => {
                                                setFormData({ ...formData, url: e.target.value })
                                                setFieldErrors({ ...fieldErrors, url: "" })
                                            }}
                                            disabled={saving}
                                            className={fieldErrors.url ? "border-red-500 focus:border-red-500" : ""}
                                        />
                                        {fieldErrors.url && (
                                            <p className="text-sm text-red-500 mt-1">{fieldErrors.url}</p>
                                        )}

                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <PdfUpload
                                            label="PDF Document *"
                                            value={formData.url}
                                            onChange={handleFileUploadSuccess}
                                            endpoint={UPLOAD_ENDPOINTS.KNOWLEDGE_CENTER_PDF}
                                            maxSize={10 * 1024 * 1024}
                                            disabled={saving}
                                        />
                                        {fieldErrors.url && (
                                            <p className="text-sm text-red-500 mt-1">{fieldErrors.url}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </form>
                    </section>
                </div>

                <SheetFooter className="flex flex-row justify-end gap-3 border-t border-border/40 pt-4 sm:flex-row">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={saving}
                    >
                        {saving ? "Creating..." : "Create Entry"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
