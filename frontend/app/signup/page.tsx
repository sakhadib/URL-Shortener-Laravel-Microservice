"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Link } from "lucide-react"
import { RegisterForm } from "@/components/register-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const response = await fetch("http://localhost:5050/api/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.ok) {
            router.push("/")
            return
          }
        } catch (err) {
          localStorage.removeItem("token")
        }
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Link className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LinkShort</span>
          </a>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <a href="/">← Back to Home</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Signup Form */}
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-4">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Sign in here
              </a>
            </p>
          </div>

          <RegisterForm
            onSuccess={() => {
              router.push("/")
            }}
          />
        </div>
      </div>
    </div>
  )
}
