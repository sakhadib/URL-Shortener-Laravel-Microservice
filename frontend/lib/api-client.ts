// API configuration and client
const API_BASE_URL = 'http://localhost:5050/api'

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = true
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available and required
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token && requireAuth) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    let response: Response
    
    try {
      console.log('Making request to:', url) 
      console.log('Request method:', config.method || 'GET')
      console.log('Request headers:', config.headers)
      console.log('Request body:', config.body)
      
      response = await fetch(url, config)
      
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      // Try to get response text for debugging
      const responseText = await response.clone().text()
      console.log('Response body:', responseText)
      
    } catch (error) {
      console.error('Network error details:', error)
      throw new Error(`Cannot connect to server at ${this.baseUrl}. Please check if the backend is running.`)
    }
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`
      
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
        
        // Handle specific error cases
        if (response.status === 500) {
          errorMessage = `Server error: ${errorMessage}`
        } else if (response.status === 422) {
          // Validation errors
          if (errorData.errors) {
            const firstError = Object.values(errorData.errors)[0]
            if (Array.isArray(firstError)) {
              errorMessage = firstError[0] as string
            }
          }
        }
      } catch (e) {
        // If JSON parsing fails, use the status-based message
        if (response.status === 500) {
          errorMessage = 'Internal server error. Please try again later.'
        } else if (response.status === 404) {
          errorMessage = 'API endpoint not found. Please check if the backend is running.'
        } else if (response.status === 403 || response.status === 401) {
          errorMessage = 'Authentication failed. Please login again.'
        }
      }
      
      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        // Clear invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
        }
      }
      
      throw new Error(errorMessage)
    }

    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false) // No auth required for login
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }, false) // No auth required for registration
  }

  async getProfile(): Promise<User> {
    return this.makeRequest<User>('/me')
  }

  async refreshToken(): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
    })
  }

  // Links endpoints
  async createLink(targetUrl: string, customCode?: string): Promise<ApiResponse<Link>> {
    return this.makeRequest<ApiResponse<Link>>('/links', {
      method: 'POST',
      body: JSON.stringify({
        target_url: targetUrl,
        custom_code: customCode,
      }),
    })
  }

  async getLinks(): Promise<ApiResponse<Link[]>> {
    return this.makeRequest<ApiResponse<Link[]>>('/links')
  }

  async getLinkDetail(code: string): Promise<ApiResponse<LinkDetail>> {
    return this.makeRequest<ApiResponse<LinkDetail>>(`/links/${code}`)
  }

  async deleteLink(id: number): Promise<ApiResponse<any>> {
    return this.makeRequest<ApiResponse<any>>(`/links/${id}`, {
      method: 'DELETE',
    })
  }

  // Test function to mimic exact Postman request
  async testRegister() {
    const url = 'http://localhost:5050/api/auth/register'
    const data = {
      "name": "TestUser",
      "email": "test@gmail.com", 
      "password": "secret123"
    }
    
    console.log('Testing direct fetch similar to Postman...')
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      console.log('Direct test response:', response.status)
      const responseData = await response.json()
      console.log('Direct test data:', responseData)
      
      return responseData
    } catch (error) {
      console.error('Direct test error:', error)
      throw error
    }
  }

  // Public redirect endpoint (no auth required)
  getRedirectUrl(code: string): string {
    return `${this.baseUrl}/r/${code}`
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Types for API responses
export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  user?: User
}

export interface Link {
  id: number
  user_id: number
  target_url: string
  code: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LinkDetail extends Link {
  total_clicks?: number
  last_click?: string
  clicks?: Click[]
}

export interface Click {
  id: number
  link_id: number
  clicked_at: string
  ip_address?: string
  user_agent?: string
  referer?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}