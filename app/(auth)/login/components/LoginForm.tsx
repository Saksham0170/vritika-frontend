'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, UserCheck } from "lucide-react"
import { login } from '@/services/auth'

export default function LoginForm() {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: '', password: '', role: 'admin' as 'admin' | 'superAdmin' })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (error) setError('')
    }

    const handleRoleChange = (value: string) => {
        setFormData(prev => ({ ...prev, role: value as 'admin' | 'superAdmin' }))
        if (error) setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        console.log('Submit clicked')
        e.preventDefault()
        setIsLoading(true)
        setError('')

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields')
            setIsLoading(false)
            return
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address')
            setIsLoading(false)
            return
        }

        try {
            const res = await login(formData)

            // Check if response has the expected structure
            if (res && res.success) {
                console.log('Login successful:', res)
                console.log('User data:', res.userData)

                // No need to store in localStorage - cookies are set by the API route
                // The token is now in an HTTP-only cookie
                // User data is in a separate accessible cookie

                // Redirect to dashboard
                router.push('/dashboard')
            } else {
                setError('Invalid response from server. Please try again.')
            }
        } catch (err: any) {
            console.error('Login error:', err)
            setError(err.message || 'Login failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
                <CardDescription className="text-center">Enter your credentials to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-4 w-4" />Email address</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" className="w-full" />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="flex items-center gap-2"><Lock className="h-4 w-4" />Password</Label>
                        <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Enter your password" className="w-full" />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2"><UserCheck className="h-4 w-4" />Role</Label>
                        <Select value={formData.role} onValueChange={handleRoleChange}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select your role" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="superAdmin">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Error */}
                    {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

                    {/* Submit */}
                    <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : 'Sign in'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
