import { useState, useCallback } from 'react'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>
  reset: () => void
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState({ data: null, loading: true, error: null })

      try {
        const result = await apiFunction(...args)
        setState({ data: result, loading: false, error: null })
        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
        setState({ data: null, loading: false, error: errorMessage })
        return null
      }
    },
    [apiFunction]
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

// Toast notification helper
export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  // For now, we'll use simple alerts - can be enhanced with a proper toast library later
  if (type === 'error') {
    console.error(message)
  } else {
    console.info(message)
  }
  
  // You could integrate with a toast library like react-hot-toast or sonner here
  alert(`${type.toUpperCase()}: ${message}`)
}

// Auth helper functions
export function isAuthenticated(): boolean {
  return typeof window !== 'undefined' && !!localStorage.getItem('token')
}

export function getStoredToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null
}

export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
  }
}