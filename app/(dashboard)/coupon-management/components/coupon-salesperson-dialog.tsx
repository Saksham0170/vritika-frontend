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
import { Label } from "@/components/ui/label"
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multiselect"
import { LoadingSpinner } from "@/components/ui/loading-components"
import { Badge } from "@/components/ui/badge"
import {
    getCouponById,
    getSalesPersons,
    assignSalesPersonsToCoupon,
    removeSalesPersonsFromCoupon
} from "@/services/coupon"
import { Coupon, SalesPerson } from "@/types/coupon"
import { useToast } from "@/hooks/use-toast"

interface CouponSalespersonDialogProps {
    couponId: string | null
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

export function CouponSalespersonDialog({
    couponId,
    open,
    onClose,
    onSuccess
}: CouponSalespersonDialogProps) {
    const { toast } = useToast()
    const [coupon, setCoupon] = useState<Coupon | null>(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [salesPersons, setSalesPersons] = useState<SalesPerson[]>([])
    const [salesPersonOptions, setSalesPersonOptions] = useState<MultiSelectOption[]>([])
    const [selectedSalesPersons, setSelectedSalesPersons] = useState<string[]>([])

    // Load coupon data and salespeople when dialog opens
    useEffect(() => {
        if (couponId && open) {
            setLoading(true)
            setError(null)

            // Load both coupon data and salespeople
            Promise.all([
                getCouponById(couponId),
                getSalesPersons()
            ])
                .then(([couponData, salesPersonsResponse]) => {
                    setCoupon(couponData)
                    const salesPersonsData = salesPersonsResponse.data?.data || []
                    setSalesPersons(salesPersonsData)

                    // Set up sales person options
                    const options = salesPersonsData.map(person => ({
                        value: person._id,
                        label: `${person.name} (${person.email})`
                    }))
                    setSalesPersonOptions(options)

                    // Set currently assigned salespeople
                    const assignedIds = couponData.assignedSalesPersons?.map(p => p._id) || []
                    setSelectedSalesPersons(assignedIds)
                })
                .catch((err: unknown) => {
                    const errorMessage = err instanceof Error ? err.message : "Failed to load data"
                    setError(errorMessage)
                })
                .finally(() => setLoading(false))
        }
    }, [couponId, open])

    const handleAssignSalespeople = async () => {
        if (!couponId || !coupon) return

        try {
            setSaving(true)

            // Find salespeople to add (selected but not currently assigned)
            const currentlyAssigned = coupon.assignedSalesPersons?.map(p => p._id) || []
            const toAssign = selectedSalesPersons.filter(id => !currentlyAssigned.includes(id))

            // Find salespeople to remove (currently assigned but not selected)
            const toRemove = currentlyAssigned.filter(id => !selectedSalesPersons.includes(id))

            // Perform assign and remove operations
            const promises = []

            if (toAssign.length > 0) {
                promises.push(assignSalesPersonsToCoupon(couponId, toAssign))
            }

            if (toRemove.length > 0) {
                promises.push(removeSalesPersonsFromCoupon(couponId, toRemove))
            }

            if (promises.length > 0) {
                await Promise.all(promises)

                toast({
                    title: "Success",
                    description: "Salesperson assignments updated successfully",
                    variant: "success"
                })

                onSuccess?.()
            }

            onClose()
        } catch (error: unknown) {
            console.error("Error updating salesperson assignments:", error)
            toast({
                title: "Error updating assignments",
                description: error instanceof Error ? error.message : 'Unknown error',
                variant: "destructive"
            })
        } finally {
            setSaving(false)
        }
    }

    const resetForm = () => {
        setSelectedSalesPersons([])
    }

    const handleClose = () => {
        if (saving) return
        resetForm()
        onClose()
    }

    const getAssignedSalesPersonNames = () => {
        if (!coupon?.assignedSalesPersons?.length) return []
        return coupon.assignedSalesPersons.map(person => person.name)
    }

    const getSelectedSalesPersonNames = () => {
        if (!selectedSalesPersons.length || !salesPersons.length) return []
        return selectedSalesPersons
            .map(id => {
                const person = salesPersons.find(p => p._id === id)
                return person?.name
            })
            .filter(Boolean)
    }

    const hasChanges = () => {
        const currentlyAssigned = coupon?.assignedSalesPersons?.map(p => p._id) || []
        const currentSet = new Set(currentlyAssigned)
        const selectedSet = new Set(selectedSalesPersons)

        if (currentSet.size !== selectedSet.size) return true

        for (const id of currentSet) {
            if (!selectedSet.has(id)) return true
        }

        return false
    }

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent side="right" className="w-[80vw] sm:w-[70vw] lg:w-[50vw] xl:w-[40vw] max-w-2xl overflow-y-auto rounded-2xl border border-border/40 bg-background text-foreground shadow-lg">
                <SheetHeader className="bg-background/70 backdrop-blur-md border-b border-border/40">
                    <SheetTitle className="text-xl font-semibold py-0">
                        Manage Salesperson Assignments
                        {coupon?.couponCode && (
                            <div className="text-sm font-normal text-muted-foreground mt-1">
                                Coupon: {coupon.couponCode}
                            </div>
                        )}
                    </SheetTitle>
                </SheetHeader>

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <LoadingSpinner message="Loading coupon and salesperson data..." />
                    </div>
                )}

                {error && (
                    <div className="text-red-600 text-center py-8 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}

                {coupon && !loading && !error && (
                    <div className="py-4 px-6">
                        <section className="rounded-xl border border-border/50 dark:border-border/60 bg-card/30 dark:bg-card/50 p-6 space-y-6 shadow-sm">
                            {/* Current Assignments */}
                            <div>
                                <Label className="mb-2 text-sm font-medium">Currently Assigned Salespeople</Label>
                                <div className="flex flex-wrap gap-2 mt-2 p-3 bg-muted/50 rounded-md border border-border/30 min-h-[50px]">
                                    {coupon.assignedSalesPersons?.length ? (
                                        coupon.assignedSalesPersons.map((person, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {person.name} ({person.email})
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-muted-foreground text-sm">No salespeople currently assigned</span>
                                    )}
                                </div>
                            </div>

                            {/* Salesperson Selection */}
                            <div>
                                <Label htmlFor="salespersonSelect" className="mb-2 text-sm font-medium">
                                    Select Salespeople to Assign
                                </Label>
                                <MultiSelect
                                    options={salesPersonOptions}
                                    value={selectedSalesPersons}
                                    onValueChange={(value: string[]) => setSelectedSalesPersons(value)}
                                    placeholder="Choose salespeople..."
                                    disabled={saving}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Select the salespeople you want to assign to this coupon.
                                    Unselected currently assigned salespeople will be removed.
                                </p>
                            </div>

                            {/* Preview Changes */}
                            {hasChanges() && (
                                <div className="border rounded-lg p-4 bg-blue-50/50 dark:bg-blue-950/20">
                                    <Label className="mb-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                                        Preview Changes
                                    </Label>

                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="font-medium text-green-700 dark:text-green-300">
                                                Will be assigned:
                                            </span>
                                            <span className="ml-1">
                                                {(() => {
                                                    const currentlyAssigned = coupon.assignedSalesPersons?.map(p => p._id) || []
                                                    const toAssign = selectedSalesPersons.filter(id => !currentlyAssigned.includes(id))
                                                    const names = toAssign.map(id => {
                                                        const person = salesPersons.find(p => p._id === id)
                                                        return person?.name
                                                    }).filter(Boolean)
                                                    return names.length > 0 ? names.join(', ') : 'None'
                                                })()}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="font-medium text-red-700 dark:text-red-300">
                                                Will be removed:
                                            </span>
                                            <span className="ml-1">
                                                {(() => {
                                                    const currentlyAssigned = coupon.assignedSalesPersons?.map(p => p._id) || []
                                                    const toRemove = currentlyAssigned.filter(id => !selectedSalesPersons.includes(id))
                                                    const names = toRemove.map(id => {
                                                        const person = coupon.assignedSalesPersons?.find(p => p._id === id)
                                                        return person?.name
                                                    }).filter(Boolean)
                                                    return names.length > 0 ? names.join(', ') : 'None'
                                                })()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                )}

                <SheetFooter className="flex flex-row justify-end gap-3 border-t border-border/40 pt-4 sm:flex-row">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAssignSalespeople}
                        disabled={saving || loading || !!error || !hasChanges()}
                    >
                        {saving ? "Updating..." : "Update Assignments"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}