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
import { createRoleCommission } from "@/services/role-commission"
import { getSubAdmins } from "@/services/sub-admin"
import { CreateRoleCommissionRequest } from "@/types/role-commission"
import { SubAdmin } from "@/types/sub-admin"
import { useToast } from "@/hooks/use-toast"

interface RoleCommissionAddDialogProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

export function RoleCommissionAddDialog({
    open,
    onClose,
    onSuccess,
}: RoleCommissionAddDialogProps) {
    const [loading, setLoading] = useState(false)
    const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([])
    const [loadingSubAdmins, setLoadingSubAdmins] = useState(false)
    const [formData, setFormData] = useState<CreateRoleCommissionRequest>({
        subAdminId: "",
        commissionPercentage: 0,
        description: "",
    })
    const { toast } = useToast()

    // Load sub-admins when component mounts
    useEffect(() => {
        if (open) {
            loadSubAdmins()
        }
    }, [open])

    const loadSubAdmins = async () => {
        try {
            setLoadingSubAdmins(true)
            const subAdminsList = await getSubAdmins()
            setSubAdmins(subAdminsList || [])
        } catch (error) {
            console.error('Error loading sub-admins:', error)
            toast({
                title: "Error",
                description: "Failed to load sub-admins",
                variant: "destructive",
            })
        } finally {
            setLoadingSubAdmins(false)
        }
    }

    const handleClose = () => {
        onClose()
        setFormData({
            subAdminId: "",
            commissionPercentage: 0,
            description: "",
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.subAdminId || !formData.commissionPercentage || !formData.description) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            })
            return
        }

        if (formData.commissionPercentage < 0 || formData.commissionPercentage > 100) {
            toast({
                title: "Error",
                description: "Commission percentage must be between 0 and 100",
                variant: "destructive",
            })
            return
        }

        try {
            setLoading(true)
            await createRoleCommission(formData)
            toast({
                title: "Success",
                description: "Sub-admin commission created successfully",
            })
            onSuccess()
            handleClose()
        } catch (error) {
            console.error("Error creating sub-admin commission:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create sub-admin commission",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: keyof CreateRoleCommissionRequest, value: string | number | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent side="right"
                className="w-[90vw] sm:w-[70vw] lg:w-[50vw] xl:w-[30vw] max-w-4xl overflow-y-auto rounded-2xl border border-border/40 bg-background text-foreground shadow-lg">
                <SheetHeader className="bg-zinc-100/70 dark:bg-background/70 backdrop-blur-md border-b border-border/40">
                    <SheetTitle className="text-xl font-semibold py-0">Add New Sub-Admin Commission</SheetTitle>
                </SheetHeader>

                <div className="py-4 px-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="subAdminId">Sub-Admin *</Label>
                            <Select
                                value={formData.subAdminId}
                                onValueChange={(value) => handleInputChange("subAdminId", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={loadingSubAdmins ? "Loading sub-admins..." : "Select a sub-admin"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {subAdmins.map((subAdmin) => (
                                        <SelectItem key={subAdmin._id} value={subAdmin._id}>
                                            {subAdmin.name} ({subAdmin.email}) - Level {subAdmin.level}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="commissionPercentage">Commission Percentage *</Label>
                            <Input
                                id="commissionPercentage"
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={formData.commissionPercentage}
                                onChange={(e) => handleInputChange("commissionPercentage", parseFloat(e.target.value) || 0)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                placeholder="Enter description for this commission level..."
                                required
                            />
                        </div>
                    </form>
                </div>

                <SheetFooter className="mt-6 px-6">
                    <div className="flex justify-end space-x-3 w-full">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} onClick={handleSubmit}>
                            {loading ? "Creating..." : "Create Commission"}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}