"use client"

import { useEffect, useState } from "react"
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
import { getRoleCommissionById, updateRoleCommission } from "@/services/role-commission"
import { RoleCommission, UpdateRoleCommissionRequest } from "@/types/role-commission"
import { useToast } from "@/hooks/use-toast"

interface RoleCommissionEditDialogProps {
    roleCommissionId: string | null
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

export function RoleCommissionEditDialog({
    roleCommissionId,
    open,
    onClose,
    onSuccess,
}: RoleCommissionEditDialogProps) {
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(false)
    const [roleCommission, setRoleCommission] = useState<RoleCommission | null>(null)
    const [formData, setFormData] = useState<UpdateRoleCommissionRequest>({})
    const { toast } = useToast()

    useEffect(() => {
        if (roleCommissionId && open) {
            const fetchRoleCommission = async () => {
                try {
                    setFetchLoading(true)
                    const data = await getRoleCommissionById(roleCommissionId)
                    setRoleCommission(data)
                    setFormData({
                        level: data.level,
                        commissionPercentage: data.commissionPercentage,
                        description: data.description,
                        status: data.status,
                    })
                } catch (error) {
                    console.error("Error fetching role commission:", error)
                    toast({
                        title: "Error",
                        description: "Failed to load role commission details",
                        variant: "destructive",
                    })
                } finally {
                    setFetchLoading(false)
                }
            }

            fetchRoleCommission()
        }
    }, [roleCommissionId, open, toast])

    const handleClose = () => {
        onClose()
        setRoleCommission(null)
        setFormData({})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!roleCommissionId) return

        if (formData.commissionPercentage !== undefined && (formData.commissionPercentage < 0 || formData.commissionPercentage > 100)) {
            toast({
                title: "Error",
                description: "Commission percentage must be between 0 and 100",
                variant: "destructive",
            })
            return
        }

        if (formData.level !== undefined && formData.level < 1) {
            toast({
                title: "Error",
                description: "Level must be at least 1",
                variant: "destructive",
            })
            return
        }

        try {
            setLoading(true)
            await updateRoleCommission(roleCommissionId, formData)
            toast({
                title: "Success",
                description: "Role commission updated successfully",
            })
            onSuccess()
            handleClose()
        } catch (error) {
            console.error("Error updating role commission:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update role commission",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: keyof UpdateRoleCommissionRequest, value: string | number | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    if (!open) return null

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent side="right"
                className="w-[90vw] sm:w-[80vw] lg:w-[60vw] xl:w-[50vw] max-w-4xl overflow-y-auto rounded-2xl border border-border/40 bg-background text-foreground shadow-lg">
                <SheetHeader className="bg-zinc-100/70 dark:bg-background/70 backdrop-blur-md border-b border-border/40">
                    <SheetTitle className="text-xl font-semibold py-0">Edit Role Commission</SheetTitle>
                </SheetHeader>

                {fetchLoading ? (
                    <div className="space-y-4 mt-6 px-6">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                        <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                ) : roleCommission ? (
                    <div className="py-4 px-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="level">Level</Label>
                                    <Input
                                        id="level"
                                        type="number"
                                        min="1"
                                        value={formData.level ?? roleCommission.level}
                                        onChange={(e) => handleInputChange("level", parseInt(e.target.value) || 1)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="commissionPercentage">Commission Percentage</Label>
                                    <Input
                                        id="commissionPercentage"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={formData.commissionPercentage ?? roleCommission.commissionPercentage}
                                        onChange={(e) => handleInputChange("commissionPercentage", parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description ?? roleCommission.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    placeholder="Enter description for this commission level..."
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="status"
                                    checked={formData.status ?? roleCommission.status}
                                    onCheckedChange={(checked: boolean) => handleInputChange("status", checked)}
                                />
                                <Label htmlFor="status">Active</Label>
                            </div>

                            <SheetFooter className="mt-6">
                                <div className="flex justify-end space-x-2 w-full">
                                    <Button type="button" variant="outline" onClick={handleClose}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? "Updating..." : "Update Role Commission"}
                                    </Button>
                                </div>
                            </SheetFooter>
                        </form>
                    </div>
                ) : null}
            </SheetContent>
        </Sheet>
    )
}