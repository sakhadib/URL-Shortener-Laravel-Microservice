"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Link, BarChart3, Zap, Shield, Globe, ArrowRight, Copy, ExternalLink, MousePointer, Sparkles, Check } from "lucide-react"
import { Dashboard } from "@/components/dashboard"
import { ConnectionStatus } from "@/components/connection-status"
import { ThemeToggle } from "@/components/theme-toggle"
import { apiClient, type User } from "@/lib/api-client"
// import { useBackendConnection } from "@/lib/connection-status"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Animation states
  const [currentDemo, setCurrentDemo] = useState(0)
  const [animateArrow, setAnimateArrow] = useState(false)
  const [showResult, setShowResult] = useState(false)
  
  // const { isConnected, isChecking, checkConnection } = useBackendConnection()
  const isConnected = true // Temporarily disable connection checking
  const isChecking = false
  const checkConnection = () => {}
  
  // Demo data
  const demoUrls = [
    { 
      long: "https://www.example.com/very/long/url/with/many/parameters?utm_source=social&utm_medium=facebook", 
      short: "link.sh/abc123",
      title: "Social Media Link"
    },
    { 
      long: "https://github.com/user/repository/blob/main/src/components/VeryLongComponentName.tsx", 
      short: "link.sh/gh-code",
      title: "GitHub Repository"
    },
    { 
      long: "https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit", 
      short: "link.sh/doc-123",
      title: "Google Document"
    }
  ]

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const userData = await apiClient.getProfile()
          setUser(userData)
          setIsAuthenticated(true)
        } catch (err) {
          console.error("Authentication check failed:", err)
          // Clear invalid token
          localStorage.removeItem("token")
          setUser(null)
          setIsAuthenticated(false)
        }
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  // Enhanced animation cycle for the demo
  useEffect(() => {
    if (!isAuthenticated) {
      const interval = setInterval(() => {
        // Start animation sequence
        setAnimateArrow(true)
        
        // Show result after longer processing animation
        setTimeout(() => {
          setShowResult(true)
        }, 4000)
        
        // Keep the complete state longer, then reset and switch to next demo
        setTimeout(() => {
          setShowResult(false)
          setAnimateArrow(false)
          
          // Smooth transition to next demo
          setTimeout(() => {
            setCurrentDemo((prev) => (prev + 1) % demoUrls.length)
          }, 800)
        }, 12000)
      }, 16000)

      return () => clearInterval(interval)
    }
  }, [isAuthenticated, demoUrls.length])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Dashboard user={user!} onLogout={() => {
      localStorage.removeItem("token")
      setIsAuthenticated(false)
      setUser(null)
    }} />
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
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <a href="/login">Sign In</a>
            </Button>
            <Button size="sm" asChild>
              <a href="/signup">Sign Up</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Connection Status */}
      <div className="container mx-auto px-4 pt-4">
        <ConnectionStatus 
          isConnected={isConnected} 
          isChecking={isChecking} 
          onRetry={checkConnection}
        />
      </div>

      {/* Hero Section */}
      <section className="pt-4 pb-8 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Shorten URLs with
            <span className="text-primary"> Precision</span>
          </h1>
          <p className="text-base text-muted-foreground mb-6 whitespace-nowrap max-w-none mx-auto">
            Transform complex URLs into clean, shareable links. Track performance and manage everything in one place.
          </p>

          {/* Enhanced Demo */}
          <Card className="max-w-6xl mx-auto mb-6">
            <CardContent className="p-4">
              {/* Demo Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Live Demo
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {demoUrls[currentDemo].title}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Watch the transformation</span>
              </div>

              {/* Enhanced Demo Animation */}
              <div className="grid lg:grid-cols-7 gap-3 items-center">
                {/* Long URL Section */}
                <div className="lg:col-span-3">
                  <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                    Original URL
                  </div>
                  <div className={`relative overflow-hidden bg-muted/40 border rounded-lg p-2.5 font-mono text-xs break-all transition-all duration-700 ease-in-out ${
                    animateArrow 
                      ? 'border-primary/50 bg-primary/10 shadow-sm shadow-primary/20 scale-[1.02]' 
                      : 'border-muted hover:border-muted-foreground/20'
                  }`}>
                    {demoUrls[currentDemo].long}
                    
                    {/* Scanning effect */}
                    {animateArrow && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-pulse"></div>
                        <div className="absolute -top-1 -right-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        </div>
                        <div className="absolute top-1 left-1">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className={`mt-1 text-xs transition-colors duration-500 ${
                    animateArrow ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}>
                    Length: {demoUrls[currentDemo].long.length} chars
                  </div>
                </div>

                {/* Arrow and Process */}
                <div className="lg:col-span-1 flex flex-col items-center justify-center relative">
                  {/* Arrow - hidden when processing */}
                  <div className={`transform transition-all duration-1000 ease-out ${
                    animateArrow 
                      ? 'opacity-0 scale-75' 
                      : 'opacity-100 scale-100'
                  }`}>
                    <ArrowRight className="w-5 h-5 drop-shadow-sm text-muted-foreground" />
                  </div>
                  
                  {/* Processing animation - replaces arrow */}
                  {animateArrow && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        {showResult ? (
                          // Completed state - show check icon
                          <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        ) : (
                          // Processing state - show loading spinner
                          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        )}
                        <span className={`text-xs font-medium transition-all duration-500 ${
                          showResult ? 'text-emerald-600' : 'text-primary'
                        }`}>
                          {showResult ? 'Complete!' : 'Processing...'}
                        </span>
                      </div>
                      
                      {/* Processing effects to match other sections */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse"></div>
                      {showResult && (
                        <>
                          <div className="absolute -top-1 -left-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                          </div>
                          <div className="absolute -bottom-1 -right-1">
                            <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Short URL Section */}
                <div className="lg:col-span-3">
                  <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                    Shortened URL
                  </div>
                  <div className={`relative overflow-hidden bg-primary/5 border border-primary/20 rounded-lg p-2.5 font-mono text-sm transition-all duration-700 ease-out ${
                    showResult 
                      ? 'opacity-100 scale-100 border-primary/60 shadow-lg shadow-primary/10 bg-gradient-to-r from-primary/5 to-green/5' 
                      : 'opacity-40 scale-95 border-primary/10'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-primary font-semibold transition-all duration-500 ${
                        showResult ? 'text-primary' : 'text-primary/60'
                      }`}>
                        {demoUrls[currentDemo].short}
                      </span>
                      <div className="flex gap-1">
                        <button className={`p-1 rounded hover:bg-muted/40 transition-all duration-200 ${
                          showResult ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                        }`}>
                          <Copy className="w-3 h-3 text-primary" />
                        </button>
                        <button className={`p-1 rounded hover:bg-muted/40 transition-all duration-200 delay-75 ${
                          showResult ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                        }`}>
                          <ExternalLink className="w-3 h-3 text-primary" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Success shine effect */}
                    {showResult && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
                    )}
                  </div>
                  <div className={`mt-1 text-xs transition-all duration-500 ${
                    showResult ? 'text-emerald-600 font-medium' : 'text-muted-foreground'
                  }`}>
                    Length: {demoUrls[currentDemo].short.length} chars • 
                    <span className={`ml-1 transition-colors duration-500 ${
                      showResult ? 'text-emerald-600 font-semibold' : 'text-emerald-600/60'
                    }`}>
                      {Math.round((1 - demoUrls[currentDemo].short.length / demoUrls[currentDemo].long.length) * 100)}% shorter
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Section */}
              <div className="mt-4 pt-3 border-t border-border/30">
                <div className="text-center mb-3">
                  <h3 className="font-semibold text-foreground text-base mb-1">Try it yourself</h3>
                  <p className="text-sm text-muted-foreground">Paste any URL to see the magic happen</p>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://example.com/your-url..." 
                    className="flex-1 font-mono text-xs h-9 bg-card border border-border focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all duration-200" 
                  />
                  <Button className="group h-9 px-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/85 shadow-sm hover:shadow-md transition-all duration-200">
                    <Link className="w-3 h-3 mr-1 group-hover:scale-105 transition-transform" />
                    Shorten
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  <a href="/signup" className="text-primary hover:underline font-medium">
                    Sign up free
                  </a>{" "}
                  for analytics & management
                </p>
              </div>

              {/* Benefits Row - Bottom Section */}
              <div className="mt-4 pt-3 border-t border-border/30">
                <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                  <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200 shadow-sm">
                    <div className="text-base font-bold text-emerald-600">
                      {Math.round((1 - demoUrls[currentDemo].short.length / demoUrls[currentDemo].long.length) * 100)}%
                    </div>
                    <div className="text-xs text-emerald-700">Reduction</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg border border-primary/30 shadow-sm">
                    <div className="text-base font-bold text-primary">0.2s</div>
                    <div className="text-xs text-primary/80">Processing</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-violet-50 to-violet-100 rounded-lg border border-violet-200 shadow-sm">
                    <div className="text-base font-bold text-violet-600">∞</div>
                    <div className="text-xs text-violet-700">Clicks</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="text-center hover:shadow-sm transition-all duration-200 border hover:border-border/60">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Click Analytics</h3>
                <p className="text-muted-foreground text-sm">
                  Track clicks and monitor performance for all your shortened links
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-sm transition-all duration-200 border hover:border-border/60">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Custom Codes</h3>
                <p className="text-muted-foreground text-sm">
                  Create memorable short links with custom codes for better branding
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-sm transition-all duration-200 border hover:border-border/60">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Globe className="w-6 h-6 text-violet-600" />
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
              <Button size="lg" asChild className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/85 shadow-sm hover:shadow-md transition-all duration-200">
                <a href="/signup">Get Started Free</a>
              </Button>
              <Button variant="outline" size="lg" asChild className="border hover:bg-muted/30 transition-all duration-200">
                <a href="/login">Sign In</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How LinkShort Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our powerful URL shortening service transforms your long links into clean, trackable short URLs in seconds
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Process Steps */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary-foreground font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Paste Your Long URL</h3>
                  <p className="text-muted-foreground text-sm">
                    Simply paste any long URL - whether it's a social media link, document, or complex webpage with parameters
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary-foreground font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Get Instant Short Link</h3>
                  <p className="text-muted-foreground text-sm">
                    Our system processes your URL in milliseconds and generates a clean, memorable short link like link.sh/abc123
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary-foreground font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Share & Track Performance</h3>
                  <p className="text-muted-foreground text-sm">
                    Share your short link anywhere and track clicks, locations, devices, and more with detailed analytics
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Features & Benefits */}
            <div className="bg-card border rounded-lg p-8">
              <h3 className="font-semibold text-foreground mb-6 text-center">What You Get</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-foreground">Up to 85% shorter URLs for better sharing</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-sm text-foreground">Lightning-fast processing in under 0.2 seconds</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-violet-100 to-violet-200 rounded-full flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 bg-violet-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-foreground">Unlimited clicks and permanent links</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 bg-rose-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-foreground">Custom codes for branded short links</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 bg-cyan-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-foreground">Detailed analytics and click tracking</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 bg-teal-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-foreground">Centralized link management dashboard</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Perfect for social media, email campaigns, marketing, and personal use
                </p>
                <Button size="sm" asChild>
                  <a href="/signup">Start for Free</a>
                </Button>
              </div>
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
