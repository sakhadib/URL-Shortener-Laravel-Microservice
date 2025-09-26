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
}

export function LinkCard({ link, onUpdate }: LinkCardProps) {
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState<LinkDetail | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const shortUrl = apiClient.getRedirectUrl(link.code)

  const fetchStats = async () => {
    setLoadingStats(true)
    try {
      const response = await apiClient.getLinkDetail(link.code)
      setStats(response.data)
    } catch (err) {
      console.error("Failed to fetch stats:", err)
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
      await apiClient.deleteLink(link.id)
      onUpdate() // Refresh the links list
    } catch (err) {
      console.error("Failed to delete link:", err)
      alert("Failed to delete link. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground truncate">{shortUrl}</h3>
              <Badge variant={link.is_active ? "default" : "secondary"}>{link.is_active ? "Active" : "Inactive"}</Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate mb-2">→ {link.target_url}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(link.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                {loadingStats ? "..." : `${stats?.total_clicks || 0} clicks`}
              </span>
              {stats?.last_click && (
                <span className="text-xs text-muted-foreground">
                  Last: {new Date(stats.last_click).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-1 bg-transparent">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied!" : "Copy"}
            </Button>

            <Button variant="outline" size="sm" onClick={() => window.open(link.target_url, "_blank")}>
              <ExternalLink className="w-3 h-3" />
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
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