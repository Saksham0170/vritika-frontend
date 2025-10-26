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
import { getSalespersons } from "@/services/salesperson"
import { CreateRoleCommissionRequest } from "@/types/role-commission"
import { Salesperson } from "@/types/salesperson"
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
    const [salespersons, setSalespersons] = useState<Salesperson[]>([])
    const [loadingSalespersons, setLoadingSalespersons] = useState(false)
    const [formData, setFormData] = useState<CreateRoleCommissionRequest>({
        salesPersonId: "",
        commissionPercentage: 0,
        description: "",
    })
    const { toast } = useToast()

    // Load salespersons when component mounts
    useEffect(() => {
        if (open) {
            loadSalespersons()
        }
    }, [open])

    const loadSalespersons = async () => {
        try {
            setLoadingSalespersons(true)
            const salespersonsList = await getSalespersons()
            setSalespersons(salespersonsList || [])
        } catch (error) {
            console.error('Error loading salespersons:', error)
            toast({
                title: "Error",
                description: "Failed to load salespersons",
                variant: "destructive",
            })
        } finally {
            setLoadingSalespersons(false)
        }
    }

    const handleClose = () => {
        onClose()
        setFormData({
            salesPersonId: "",
            commissionPercentage: 0,
            description: "",
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.salesPersonId || !formData.commissionPercentage || !formData.description) {
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
                description: "Salesperson commission created successfully",
            })
            onSuccess()
            handleClose()
        } catch (error) {
            console.error("Error creating salesperson commission:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create salesperson commission",
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
                    <SheetTitle className="text-xl font-semibold py-0">Add New Salesperson Commission</SheetTitle>
                </SheetHeader>

                <div className="py-4 px-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="salesPersonId">Salesperson *</Label>
                            <Select
                                value={formData.salesPersonId}
                                onValueChange={(value) => handleInputChange("salesPersonId", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={loadingSalespersons ? "Loading salespersons..." : "Select a salesperson"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {salespersons.map((salesperson) => (
                                        <SelectItem key={salesperson._id} value={salesperson._id}>
                                            {salesperson.name} ({salesperson.email}) - {salesperson.phoneNumber}
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