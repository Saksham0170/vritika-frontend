"use client"

import { useState } from "react"

interface ToastProps {
    title: string
    description?: string
    variant?: "default" | "destructive"
}

export function useToast() {
    const [toasts] = useState<ToastProps[]>([])

    const toast = (props: ToastProps) => {
        if (props.variant === "destructive") {
            alert(`Error: ${props.title}${props.description ? ` - ${props.description}` : ""}`)
        } else {
            alert(`${props.title}${props.description ? ` - ${props.description}` : ""}`)
        }
    }

    return { toast, toasts }
}