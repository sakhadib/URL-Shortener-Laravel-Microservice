"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Calendar, Check, BarChart3, Trash2 } from "lucide-react"
import { apiClient, type Link, type LinkDetail } from "@/lib/api-client"

interface LinkCardProps {
  link: Link
  onUpdate: () => void
  onLocalClick?: () => void
  onStatusToggle?: (linkId: number, newStatus: boolean) => void
  onDelete?: (linkId: number) => void
}

export function LinkCard({ link, onUpdate, onLocalClick, onStatusToggle, onDelete }: LinkCardProps) {
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState<LinkDetail | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [localClickCount, setLocalClickCount] = useState(0)
  const [localIsActive, setLocalIsActive] = useState(link.is_active)

  const shortUrl = apiClient.getRedirectUrl(link.code)

  const fetchStats = async () => {
    setLoadingStats(true)
    try {
      const statsData = await apiClient.getLinkStats(link.code)
      setStats(statsData)
    } catch (err) {
      console.error("Failed to fetch stats:", err)
      setStats(null)
    } finally {
      setLoadingStats(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [link.code])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this link?")) return
    
    setIsDeleting(true)
    try {
      // Remove from UI immediately if onDelete is provided
      if (onDelete) {
        onDelete(link.id)
      }
      
      // Call backend to delete from database  
      await apiClient.deleteLink(link.id)
      
      // Only call onUpdate if onDelete wasn't provided (fallback)
      if (!onDelete) {
        onUpdate()
      }
      
    } catch (err) {
      console.error("Failed to delete link:", err)
      alert("Failed to delete link. Please try again.")
      
      // If backend deletion failed, refresh to restore the link in UI
      onUpdate()
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExternalClick = () => {
    // Increment local click counter (no backend call)
    setLocalClickCount(prev => prev + 1)
    
    // Update global dashboard counter
    if (onLocalClick) {
      onLocalClick()
    }
    
    // Open the target URL
    window.open(link.target_url, "_blank")
  }

  const handleStatusToggle = () => {
    const newStatus = !localIsActive
    setLocalIsActive(newStatus)
    
    // Update dashboard analytics
    if (onStatusToggle) {
      onStatusToggle(link.id, newStatus)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground truncate">{shortUrl}</h3>
              <Badge 
                variant={localIsActive ? "default" : "secondary"} 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleStatusToggle}
              >
                {localIsActive ? "Active" : "Inactive"}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleStatusToggle}
                className={`px-2 py-1 h-auto text-xs transition-colors ${
                  localIsActive 
                    ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' 
                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900/20'
                }`}
              >
                {localIsActive ? '●' : '○'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground truncate mb-2">→ {link.target_url}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(link.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                {loadingStats ? "..." : `${((stats as any)?.stats?.total || stats?.total_clicks || 0) + localClickCount} clicks`}
              </span>
              {((stats as any)?.stats?.last_click_at || stats?.last_click) && (
                <span className="text-xs text-muted-foreground">
                  Last: {new Date((stats as any)?.stats?.last_click_at || stats?.last_click).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-1 bg-transparent hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-600 dark:hover:text-white border border-border hover:border-cyan-500 dark:hover:border-cyan-600 hover:shadow-md dark:hover:shadow-cyan-500/20 transition-all duration-200">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied!" : "Copy"}
            </Button>

            <Button variant="outline" size="sm" onClick={handleExternalClick} className="hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-600 dark:hover:text-white border border-border hover:border-cyan-500 dark:hover:border-cyan-600 hover:shadow-md dark:hover:shadow-cyan-500/20 transition-all duration-200">
              <ExternalLink className="w-3 h-3" />
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white border border-border hover:border-red-500 dark:hover:border-red-600 hover:shadow-md dark:hover:shadow-red-500/20 transition-all duration-200"
            >
              {isDeleting ? (
                <div className="w-3 h-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Trash2 className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}