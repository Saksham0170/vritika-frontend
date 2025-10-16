"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export interface MultiSelectOption {
    value: string
    label: string
}

interface MultiSelectProps {
    options: MultiSelectOption[]
    value: string[]
    onValueChange: (value: string[]) => void
    placeholder?: string
    searchPlaceholder?: string
    disabled?: boolean
}

export function MultiSelect({
    options,
    value,
    onValueChange,
    placeholder = "Select items...",
    searchPlaceholder = "Search...",
    disabled = false,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState("")

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
    )

    const selectedLabels = options
        .filter((option) => value.includes(option.value))
        .map((option) => option.label)

    const handleSelect = (optionValue: string) => {
        const newValue = value.includes(optionValue)
            ? value.filter((v) => v !== optionValue)
            : [...value, optionValue]
        onValueChange(newValue)
    }

    const handleRemove = (optionValue: string, e: React.MouseEvent) => {
        e.stopPropagation()
        onValueChange(value.filter((v) => v !== optionValue))
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-transparent h-auto min-h-10"
                    disabled={disabled}
                >
                    <div className="flex flex-wrap gap-1 w-full">
                        {value.length > 0 ? (
                            selectedLabels.map((label, index) => {
                                const optionValue = options.find((o) => o.label === label)?.value
                                return (
                                    <div key={index} className="group relative">
                                        <Badge variant="secondary" className="pr-1">
                                            {label}
                                            <button
                                                onClick={(e) => optionValue && handleRemove(optionValue, e)}
                                                className="ml-1 inline-flex items-center opacity-0 transition-opacity group-hover:opacity-100"
                                                aria-label={`Remove ${label}`}
                                                disabled={disabled}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    </div>
                                )
                            })
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onValueChange={setSearchValue}
                    />
                    <CommandEmpty>No items found.</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {filteredOptions.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={() => handleSelect(option.value)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value.includes(option.value) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}