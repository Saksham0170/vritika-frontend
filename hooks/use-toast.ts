"use client"

import { toast as sonnerToast } from "sonner"

interface ToastProps {
    title: string
    description?: string
    variant?: "default" | "destructive" | "success"
}

export function useToast() {
    const toast = (props: ToastProps) => {
        const message = props.description ? `${props.title}: ${props.description}` : props.title

        switch (props.variant) {
            case "destructive":
                sonnerToast.error(message)
                break
            case "success":
                sonnerToast.success(message)
                break
            default:
                sonnerToast(message)
                break
        }
    }

    return { toast, toasts: [] }
}