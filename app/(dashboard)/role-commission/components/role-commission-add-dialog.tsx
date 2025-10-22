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
import { Checkbox } from "@/components/ui/checkbox"
import { createRoleCommission } from "@/services/role-commission"
import { CreateRoleCommissionRequest } from "@/types/role-commission"
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
    const [formData, setFormData] = useState<CreateRoleCommissionRequest>({
        level: 1,
        commissionPercentage: 0,
        description: "",
        status: true,
    })
    const { toast } = useToast()

    const handleClose = () => {
        onClose()
        setFormData({
            level: 1,
            commissionPercentage: 0,
            description: "",
            status: true,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.level || !formData.commissionPercentage || !formData.description) {
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

        if (formData.level < 1) {
            toast({
                title: "Error",
                description: "Level must be at least 1",
                variant: "destructive",
            })
            return
        }

        try {
            setLoading(true)
            await createRoleCommission(formData)
            toast({
                title: "Success",
                description: "Role commission created successfully",
            })
            onSuccess()
            handleClose()
        } catch (error) {
            console.error("Error creating role commission:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create role commission",
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
                className="w-[90vw] sm:w-[80vw] lg:w-[60vw] xl:w-[50vw] max-w-4xl overflow-y-auto rounded-2xl border border-border/40 bg-background text-foreground shadow-lg">
                <SheetHeader className="bg-zinc-100/70 dark:bg-background/70 backdrop-blur-md border-b border-border/40">
                    <SheetTitle className="text-xl font-semibold py-0">Add New Role Commission</SheetTitle>
                </SheetHeader>

                <div className="py-4 px-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="level">Level *</Label>
                                <Input
                                    id="level"
                                    type="number"
                                    min="1"
                                    value={formData.level}
                                    onChange={(e) => handleInputChange("level", parseInt(e.target.value) || 1)}
                                    required
                                />
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

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="status"
                                checked={formData.status}
                                onCheckedChange={(checked: boolean) => handleInputChange("status", checked)}
                            />
                            <Label htmlFor="status">Active</Label>
                        </div>
                    </form>
                </div>

                <SheetFooter className="mt-6 px-6">
                    <div className="flex justify-end space-x-2 w-full">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} onClick={handleSubmit}>
                            {loading ? "Creating..." : "Create Role Commission"}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}