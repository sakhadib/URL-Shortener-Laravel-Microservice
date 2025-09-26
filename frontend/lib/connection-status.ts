import { useState, useEffect } from 'react'
import { apiClient } from './api-client'

export function useBackendConnection() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkConnection = async () => {
    setIsChecking(true)
    try {
      // Simple fetch to test if backend is reachable
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(`http://localhost:5050/api/me`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Authorization': 'Bearer invalid-token-for-connection-test'
        }
      })
      
      clearTimeout(timeoutId)
      
      // Even if we get 401/403, it means the server is responding
      setIsConnected(response.status !== 0)
    } catch (error) {
      // Network error or timeout
      setIsConnected(false)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    isConnected,
    isChecking,
    checkConnection
  }
}