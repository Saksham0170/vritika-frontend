import { getToken } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface UploadResponse {
    status: boolean
    data: {
        $metadata: {
            httpStatusCode: number
            requestId: string
            extendedRequestId: string
            attempts: number
            totalRetryDelay: number
        }
        ETag: string
        ChecksumCRC32: string
        ChecksumType: string
        ServerSideEncryption: string
        link: string
    }
    message: string
}

// Upload endpoints for different document types
export const UPLOAD_ENDPOINTS = {
    // Salesperson uploads
    SELFIE: '/upload/sales-person-selfie',
    AADHAR_FRONT: '/upload/sales-person-adhaar-front',
    AADHAR_BACK: '/upload/sales-person-adhaar-back',
    PAN_FRONT: '/upload/sales-person-pan-front',
    CANCEL_CHEQUE: '/upload/sales-person-cancel-cheque',

    // Product uploads
    PRODUCT_IMAGE: '/upload/product-image',
} as const

export type UploadEndpoint = typeof UPLOAD_ENDPOINTS[keyof typeof UPLOAD_ENDPOINTS]

// Function to get auth headers for FormData uploads
const getFormDataAuthHeaders = (): HeadersInit => {
    const token = getToken()

    if (token) {
        return {
            'Authorization': token
        }
    }

    return {}
}

export async function uploadFile(file: File, endpoint: UploadEndpoint): Promise<string> {
    try {
        const formData = new FormData()
        formData.append('file', file)

        console.log('Uploading to URL:', `${API_BASE_URL}${endpoint}`)
        console.log('File details:', {
            name: file.name,
            size: file.size,
            type: file.type
        })

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getFormDataAuthHeaders(),
            body: formData,
        })

        console.log('Response status:', response.status)
        console.log('Response headers:', Object.fromEntries(response.headers.entries()))

        // Get response text first to debug what we're receiving
        const responseText = await response.text()
        console.log('Response text:', responseText.substring(0, 500)) // Log first 500 chars

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}. Response: ${responseText.substring(0, 200)}`)
        }

        // Try to parse as JSON
        let data: UploadResponse
        try {
            data = JSON.parse(responseText)
        } catch (parseError) {
            throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}`)
        }

        if (!data.status) {
            throw new Error(`Upload failed: ${data.message || 'Unknown error'}`)
        }

        return data.data.link
    } catch (error) {
        console.error('Error uploading file:', error)
        throw error
    }
}

// Helper functions for specific upload types
// Salesperson uploads
export const uploadSelfie = (file: File) => uploadFile(file, UPLOAD_ENDPOINTS.SELFIE)
export const uploadAadharFront = (file: File) => uploadFile(file, UPLOAD_ENDPOINTS.AADHAR_FRONT)
export const uploadAadharBack = (file: File) => uploadFile(file, UPLOAD_ENDPOINTS.AADHAR_BACK)
export const uploadPanFront = (file: File) => uploadFile(file, UPLOAD_ENDPOINTS.PAN_FRONT)
export const uploadCancelCheque = (file: File) => uploadFile(file, UPLOAD_ENDPOINTS.CANCEL_CHEQUE)

// Product uploads
export const uploadProductImage = (file: File) => uploadFile(file, UPLOAD_ENDPOINTS.PRODUCT_IMAGE)