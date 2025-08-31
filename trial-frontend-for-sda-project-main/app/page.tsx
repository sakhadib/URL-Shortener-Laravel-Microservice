"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Link, BarChart3, Zap, Shield, Globe } from "lucide-react"
import { Dashboard } from "@/components/dashboard"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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
            const userData = await response.json()
            setUser(userData)
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem("token")
          }
        } catch (err) {
          localStorage.removeItem("token")
        }
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Dashboard user={user} onLogout={() => setIsAuthenticated(false)} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Link className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LinkShort</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <a href="/login">Sign In</a>
            </Button>
            <Button size="sm" asChild>
              <a href="/signup">Sign Up</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Fast & Reliable
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Shorten URLs with
            <span className="text-primary"> Lightning Speed</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Transform long, complex URLs into short, shareable links. Track clicks, analyze performance, and manage all
            your links in one powerful dashboard.
          </p>

          {/* Quick Shortener */}
          <Card className="max-w-2xl mx-auto mb-12">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input placeholder="Enter your long URL here..." className="flex-1" />
                <Button className="sm:w-auto">
                  <Link className="w-4 h-4 mr-2" />
                  Shorten URL
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                <a href="/signup" className="text-primary hover:underline">
                  Sign up
                </a>{" "}
                to track and manage your links
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Click Analytics</h3>
                <p className="text-muted-foreground text-sm">
                  Track clicks and monitor performance for all your shortened links
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Custom Codes</h3>
                <p className="text-muted-foreground text-sm">
                  Create memorable short links with custom codes for better branding
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Link Management</h3>
                <p className="text-muted-foreground text-sm">
                  Organize and manage all your shortened links in one dashboard
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6">Create your account and start shortening URLs today</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/signup">Get Started Free</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/login">Sign In</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Link className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">LinkShort</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2025 LinkShort. Built with modern web technologies.</p>
        </div>
      </footer>
    </div>
  )
}
