"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage("")

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        console.log("Reset password for:", email)
        setMessage("If an account exists with this email, you will receive a password reset link.")

        setIsLoading(false)
        setEmail("")
    }

    return (
        <div className="flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to login
                        </Link>
                    </div>
                    <CardTitle className="text-2xl text-center font-bold">Forgot Password</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email address and we will send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="sr-only">
                                Email
                            </Label>
                            <Input
                                id="email"
                                placeholder="Enter your email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        {message && (
                            <div className="text-sm text-green-600 text-center">{message}</div>
                        )}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending Reset Link
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}