"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link, Plus, LogOut, BarChart3, TrendingUp, MousePointer, Calendar, ExternalLink, Copy, Eye, PieChart, Activity } from "lucide-react"
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
                />
              ))}
            </div>
          )}
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Links</p>
                  <p className="text-3xl font-bold text-foreground">
                    {isLoadingStats ? "..." : dashboardStats?.total_links || links.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">All time</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Link className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Links</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {isLoadingStats ? "..." : getCurrentActiveLinks()}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">Currently active</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>



          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-3xl font-bold text-violet-600">
                    {isLoadingStats ? "..." : dashboardStats?.clicks_this_month || 
                      links.filter(link => {
                        const created = new Date(link.created_at)
                        const now = new Date()
                        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                      }).length
                    }
                  </p>
                  <p className="text-xs text-violet-600 mt-1">Recent activity</p>
                </div>
                <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-1 gap-6 mb-8">
          {/* Link Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Link Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Active Links', value: getCurrentActiveLinks(), color: '#10b981' },
                        { name: 'Inactive Links', value: links.length - getCurrentActiveLinks(), color: '#6b7280' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#6b7280" />
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Active ({getCurrentActiveLinks()})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Inactive ({links.length - getCurrentActiveLinks()})</span>
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
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {dashboardStats?.total_links 
                        ? Math.round(((dashboardStats?.total_clicks || 0) + localTotalClicks) / dashboardStats.total_links) 
                        : 0}
                    </div>
                    <div className="text-sm text-emerald-700 dark:text-emerald-300">Avg Clicks/Link</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {links.length > 0 ? Math.round((getCurrentActiveLinks() / links.length) * 100) : 100}%
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Active Rate</div>
                  </div>
                </div>

                {/* Mini Bar Chart */}
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Links', value: links.length, color: '#6366f1' },
                        { name: 'Active', value: getCurrentActiveLinks(), color: '#10b981' },
                        { name: 'Clicks', value: Math.min((dashboardStats?.total_clicks || 0) + localTotalClicks, 100), color: '#f59e0b' },
                      ]}
                    >
                      <XAxis dataKey="name" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
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
                <TrendingUp className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Growth Indicator */}
              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Growth Rate</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      +{dashboardStats?.clicks_this_month && dashboardStats?.total_clicks 
                        ? Math.round((dashboardStats.clicks_this_month / dashboardStats.total_clicks) * 100) 
                        : 0}%
                    </p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>

              {/* Activity Feed */}
              <div className="space-y-3">
                {dashboardStats?.recent_activity?.length ? (
                  dashboardStats.recent_activity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/50">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Link className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">{activity.link_code}</p>
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
                  <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Loading activity...</p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No recent activity</p>
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
