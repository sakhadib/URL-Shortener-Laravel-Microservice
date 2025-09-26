"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ConnectionStatusProps {
  isConnected: boolean | null
  isChecking: boolean
  onRetry: () => void
}

export function ConnectionStatus({ isConnected, isChecking, onRetry }: ConnectionStatusProps) {
  if (isConnected === true || isConnected === null) {
    return null // Don't show anything when connected or unknown
  }

  if (isConnected === false) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription className="flex items-center justify-between w-full">
          <span>Cannot connect to backend server. Please ensure the Laravel backend is running on http://localhost:5050</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            disabled={isChecking}
          >
            {isChecking ? "Checking..." : "Retry"}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}