"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, X } from "lucide-react"
import { apiClient, type ApiResponse, type Link } from "@/lib/api-client"

interface CreateLinkFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function CreateLinkForm({ onSuccess, onCancel }: CreateLinkFormProps) {
  const [targetUrl, setTargetUrl] = useState("")
  const [customCode, setCustomCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await apiClient.createLink(targetUrl, customCode || undefined)
      
      setSuccess("Link created successfully!")
      setTimeout(() => {
        onSuccess()
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Create Short Link</CardTitle>
            <CardDescription>Enter a long URL and optionally customize the short code</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="targetUrl">Target URL *</Label>
            <Input
              id="targetUrl"
              type="url"
              placeholder="https://example.com/very/long/url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customCode">Custom Code (optional)</Label>
            <Input
              id="customCode"
              type="text"
              placeholder="my-custom-link"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Leave empty to generate a random code</p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Link
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
