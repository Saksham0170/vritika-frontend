"use client"

import { useState } from "react"
import { Dropzone, DropzoneEmptyState, DropzoneContent } from "@/components/ui/shadcn-io/dropzone"
import { Button } from "@/components/ui/button"
import { X, Upload, Eye, AlertCircle } from "lucide-react"
import { uploadFile, UploadEndpoint } from "@/services/upload"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
    value?: string
    onChange: (url: string) => void
    endpoint: UploadEndpoint
    accept?: Record<string, string[]>
    maxSize?: number
    disabled?: boolean
    label?: string
    className?: string
}

export function FileUpload({
    value,
    onChange,
    endpoint,
    accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    maxSize = 5 * 1024 * 1024, // 5MB
    disabled = false,
    label = "Upload Image",
    className
}: FileUploadProps) {
    const { toast } = useToast()
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [files, setFiles] = useState<File[]>([])
    const [error, setError] = useState<string | null>(null)

    const handleDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return

        const file = acceptedFiles[0]
        setFiles([file])
        setIsUploading(true)
        setUploadProgress(0)
        setError(null) // Clear any previous errors

        try {
            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval)
                        return 90
                    }
                    return prev + 10
                })
            }, 200)

            const uploadedUrl = await uploadFile(file, endpoint)

            clearInterval(progressInterval)
            setUploadProgress(100)

            onChange(uploadedUrl)

            // Clear progress after a short delay
            setTimeout(() => {
                setUploadProgress(0)
                setIsUploading(false)
            }, 1000)

        } catch (error) {
            console.error('Upload failed:', error)
            setIsUploading(false)
            setUploadProgress(0)
            setFiles([])
            const errorMessage = error instanceof Error ? error.message : 'Upload failed. Please try again.'
            setError(errorMessage)
            toast({
                title: "Upload failed",
                description: errorMessage,
                variant: "destructive"
            })
        }
    }

    const handleRemove = () => {
        setFiles([])
        onChange("")
        setUploadProgress(0)
        setError(null) // Clear error when removing file
    }

    const openImagePreview = () => {
        if (value) {
            window.open(value, '_blank')
        }
    }

    const hasUploadedImage = value && !isUploading
    const displayFiles = hasUploadedImage ? [] : files

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <label className="text-sm font-medium text-foreground/80">
                    {label}
                </label>
            )}

            <div className="relative">
                <Dropzone
                    src={displayFiles}
                    onDrop={handleDrop}
                    accept={accept}
                    maxSize={maxSize}
                    maxFiles={1}
                    disabled={disabled || isUploading}
                    className={cn(
                        "min-h-[120px] transition-all duration-200",
                        hasUploadedImage && "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50",
                        isUploading && "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50",
                        error && "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50"
                    )}
                >
                    {error ? (
                        <div className="flex flex-col items-center space-y-3">
                            <div className="flex size-8 items-center justify-center rounded-md bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400">
                                <AlertCircle size={16} />
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-sm text-red-700 dark:text-red-300">
                                    Upload failed
                                </p>
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1 max-w-xs">
                                    {error}
                                </p>
                                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                                    Click to try again
                                </p>
                            </div>
                        </div>
                    ) : hasUploadedImage ? (
                        <div className="flex flex-col items-center space-y-3">
                            <div className="flex size-8 items-center justify-center rounded-md bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                                <Upload size={16} />
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-sm text-green-700 dark:text-green-300">
                                    Image uploaded successfully
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400">
                                    Click to replace or use buttons below
                                </p>
                            </div>
                        </div>
                    ) : isUploading ? (
                        <div className="flex flex-col items-center space-y-3">
                            <div className="flex size-8 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                                <Upload size={16} className="animate-pulse" />
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-sm text-blue-700 dark:text-blue-300">
                                    Uploading... {uploadProgress}%
                                </p>
                                <div className="w-32 h-1 bg-blue-100 rounded-full overflow-hidden dark:bg-blue-900">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-300 ease-out"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <DropzoneEmptyState />
                            <DropzoneContent />
                        </>
                    )}
                </Dropzone>

                {isUploading && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200 dark:text-red-300 dark:bg-red-950/50 dark:border-red-800">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setError(null)}
                        className="ml-auto h-auto p-1 text-red-700 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
                    >
                        <X size={14} />
                    </Button>
                </div>
            )}

            {hasUploadedImage && (
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={openImagePreview}
                        className="flex-1"
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemove}
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                    </Button>
                </div>
            )}

            {maxSize && (
                <p className="text-xs text-muted-foreground">
                    Maximum file size: {(maxSize / (1024 * 1024)).toFixed(1)}MB
                </p>
            )}
        </div>
    )
}