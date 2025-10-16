"use client"

interface LoadingSpinnerProps {
    message?: string
    size?: "sm" | "md" | "lg"
    className?: string
}

export function LoadingSpinner({
    message = "Loading...",
    size = "md",
    className = ""
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12"
    }

    return (
        <div className={`flex items-center justify-center h-32 ${className}`}>
            <div className="text-center">
                <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-primary mx-auto`}></div>
                <p className="mt-2 text-muted-foreground">{message}</p>
            </div>
        </div>
    )
}

interface ErrorMessageProps {
    message: string
    className?: string
}

export function ErrorMessage({ message, className = "" }: ErrorMessageProps) {
    return (
        <div className={`flex items-center justify-center h-32 ${className}`}>
            <div className="text-center">
                <p className="text-red-600">{message}</p>
            </div>
        </div>
    )
}