'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { login } from '@/services/auth'
import { useUserStore } from '@/store/userStore'

export default function LoginForm() {
    const router = useRouter()
    const { setUser } = useUserStore()
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
            if (res && res.success && res.userData && res.token) {
                // Store user data and token in Zustand store (localStorage)
                setUser(res.userData, res.token)

                // Redirect to dashboard
                router.push('/dashboard')
            } else {
                setError('Invalid response from server. Please try again.')
            }
        } catch (err: unknown) {
            console.error('Login error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full rounded-xl shadow-sm border border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-xl font-semibold tracking-tight text-center">Sign in to your account</CardTitle>
                <CardDescription className="text-center text-muted-foreground">Enter your credentials to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="w-full rounded-lg border-border/40"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            className="w-full rounded-lg border-border/40"
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Role</Label>
                        <Select value={formData.role} onValueChange={handleRoleChange}>
                            <SelectTrigger className="w-full rounded-lg border-border/40">
                                <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="superAdmin">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Error */}
                    {error && (
                        <Alert variant="destructive" className="rounded-lg">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg shadow-sm"
                        size="lg"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
