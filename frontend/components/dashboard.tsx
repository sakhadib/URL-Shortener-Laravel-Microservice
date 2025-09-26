"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link, Plus, LogOut } from "lucide-react"
import { CreateLinkForm } from "@/components/create-link-form"
import { LinkCard } from "@/components/link-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { apiClient, type User, type Link as LinkType } from "@/lib/api-client"

interface DashboardProps {
  user: User
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [links, setLinks] = useState<LinkType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const response = await apiClient.getLinks()
      setLinks(response.data || [])
    } catch (err) {
      console.error("Failed to fetch links:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    onLogout()
  }

  const handleLinkCreated = () => {
    setShowCreateForm(false)
    fetchLinks()
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
            <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Create Link Section */}
        <div className="mb-8">
          {!showCreateForm ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Create New Short Link</h3>
                    <p className="text-muted-foreground">Transform your long URLs into short, shareable links</p>
                  </div>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <CreateLinkForm onSuccess={handleLinkCreated} onCancel={() => setShowCreateForm(false)} />
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Link className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Links</p>
                  <p className="text-2xl font-bold">{links.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-emerald-500 rounded-full" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Links</p>
                  <p className="text-2xl font-bold">{links.filter(link => link.is_active).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-primary rounded-full" />
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">
                    {links.filter(link => {
                      const created = new Date(link.created_at)
                      const now = new Date()
                      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Links List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Links</h2>
            <Badge variant="secondary">{links.length} links</Badge>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading your links...</p>
            </div>
          ) : links.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Link className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No links yet</h3>
                <p className="text-muted-foreground mb-4">Create your first short link to get started</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Link
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {links.map((link) => (
                <LinkCard key={link.id} link={link} onUpdate={fetchLinks} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
