"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link, Plus, LogOut, BarChart3, ArrowRight, MousePointer, Calendar, ExternalLink, Copy, Eye, BarChart3 as ChartIcon, Zap } from "lucide-react"
import { CreateLinkForm } from "@/components/create-link-form"
import { LinkCard } from "@/components/link-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { apiClient, type User, type Link as LinkType, type DashboardStats } from "@/lib/api-client"
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, BarChart, Bar } from 'recharts'

interface DashboardProps {
  user: User
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [links, setLinks] = useState<LinkType[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [localTotalClicks, setLocalTotalClicks] = useState(0)
  const [localStatusChanges, setLocalStatusChanges] = useState<Record<number, boolean>>({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    await Promise.all([fetchLinks(), fetchDashboardStats()])
  }

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

  const fetchDashboardStats = async () => {
    try {
      const stats = await apiClient.getDashboardStats()
      setDashboardStats(stats)
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    onLogout()
  }

  const handleLinkCreated = () => {
    setShowCreateForm(false)
    fetchData()
  }

  const handleLinkDeleted = (linkId: number) => {
    // Remove the link from local state immediately for instant UI update
    setLinks(prevLinks => prevLinks.filter(link => link.id !== linkId))
    
    // Also remove from local status changes if it exists
    setLocalStatusChanges(prev => {
      const updated = { ...prev }
      delete updated[linkId]
      return updated
    })
  }

  const handleLocalClick = () => {
    setLocalTotalClicks(prev => prev + 1)
  }

  const handleStatusToggle = (linkId: number, newStatus: boolean) => {
    setLocalStatusChanges(prev => ({
      ...prev,
      [linkId]: newStatus
    }))
  }

  // Calculate current active links considering local changes
  const getCurrentActiveLinks = () => {
    return links.filter(link => {
      const localStatus = localStatusChanges[link.id]
      return localStatus !== undefined ? localStatus : link.is_active
    }).length
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
            <Button size="sm" onClick={handleLogout} className="bg-muted text-foreground hover:bg-cyan-500 hover:text-white border border-border hover:border-cyan-500 transition-all duration-200">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Create Link Section - Top Priority */}
        <div className="mb-8">
          {!showCreateForm ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Create New Short Link</h3>
                    <p className="text-muted-foreground">Transform your long URLs into short, shareable links</p>
                  </div>
                  <Button onClick={() => setShowCreateForm(true)} className="bg-primary hover:bg-cyan-500 text-primary-foreground hover:text-white transition-all duration-200">
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

        {/* Your Links Section */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Eye className="w-6 h-6" />
              Your Links
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{links.length} total</Badge>
              <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                {getCurrentActiveLinks()} active
              </Badge>
            </div>
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
                <Button onClick={() => setShowCreateForm(true)} className="bg-primary hover:bg-cyan-500 text-primary-foreground hover:text-white transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Link
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {links.map((link) => (
                <LinkCard 
                  key={link.id} 
                  link={link} 
                  onUpdate={fetchLinks} 
                  onLocalClick={handleLocalClick}
                  onStatusToggle={handleStatusToggle}
                  onDelete={handleLinkDeleted}
                />
              ))}
            </div>
          )}
        </div>

        {/* Analytics Overview with Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Analytics Cards - Vertical Stack */}
          <div className="lg:col-span-1 space-y-0">
            <Card className="border-0 shadow-sm rounded-none rounded-t-lg">
              <CardContent className="p-3">
                <div className="text-center">
                  <Link className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-xl font-bold text-foreground mb-0">
                    {isLoadingStats ? "..." : dashboardStats?.total_links || links.length}
                  </p>
                  <p className="text-xs text-muted-foreground">All time</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-none">
              <CardContent className="p-3">
                <div className="text-center">
                  <ArrowRight className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                  <p className="text-xl font-bold text-emerald-600 mb-0">
                    {isLoadingStats ? "..." : getCurrentActiveLinks()}
                  </p>
                  <p className="text-xs text-muted-foreground">Currently active</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-none rounded-b-lg">
              <CardContent className="p-3">
                <div className="text-center">
                  <Calendar className="w-5 h-5 mx-auto mb-1 text-violet-600" />
                  <p className="text-xl font-bold text-violet-600 mb-0">
                    {isLoadingStats ? "..." : dashboardStats?.clicks_this_month || 
                      links.filter(link => {
                        const created = new Date(link.created_at)
                        const now = new Date()
                        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                      }).length
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">Recent activity</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Link Status Distribution Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <ChartIcon className="w-6 h-6" />
                Link Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Active Links', value: getCurrentActiveLinks(), color: '#10b981' },
                        { name: 'Inactive Links', value: links.length - getCurrentActiveLinks(), color: '#6b7280' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#6b7280" />
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Active ({getCurrentActiveLinks()})</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Inactive ({links.length - getCurrentActiveLinks()})</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>



        {/* Quick Actions & Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Metrics */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {dashboardStats?.total_links 
                        ? Math.round(((dashboardStats?.total_clicks || 0) + localTotalClicks) / dashboardStats.total_links) 
                        : 0}
                    </div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-300">Avg Clicks/Link</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {links.length > 0 ? Math.round((getCurrentActiveLinks() / links.length) * 100) : 100}%
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Active Rate</div>
                  </div>
                </div>

                {/* Mini Bar Chart */}
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Links', value: links.length },
                        { name: 'Active', value: getCurrentActiveLinks() },
                        { name: 'Clicks', value: Math.min((dashboardStats?.total_clicks || 0) + localTotalClicks, 100) },
                      ]}
                    >
                      <XAxis dataKey="name" />
                      <Tooltip />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        <Cell fill="#6366f1" />
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Growth */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Growth Indicator */}
              <div className="p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-green-700 dark:text-green-300">Growth Rate</p>
                    <p className="text-base font-bold text-green-600 dark:text-green-400">
                      +{dashboardStats?.clicks_this_month && dashboardStats?.total_clicks 
                        ? Math.round((dashboardStats.clicks_this_month / dashboardStats.total_clicks) * 100) 
                        : 0}%
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-green-600" />
                </div>
              </div>

              {/* Activity Feed */}
              <div className="space-y-2">
                {dashboardStats?.recent_activity?.length ? (
                  dashboardStats.recent_activity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors border border-border/50">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Link className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate text-foreground">{activity.link_code}</p>
                        <p className="text-xs text-muted-foreground">
                          Created {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        New
                      </Badge>
                    </div>
                  ))
                ) : isLoadingStats ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="text-xs text-muted-foreground mt-2">Loading activity...</p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Zap className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>




      </div>
    </div>
  )
}
