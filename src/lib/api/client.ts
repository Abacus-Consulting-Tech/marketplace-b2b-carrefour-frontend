import axios from 'axios'

// Always use Next.js API routes as proxy to avoid CORS issues
// API routes run server-side and can call the backend directly
const getBaseURL = () => {
  // Use /api routes which proxy to the backend
  // This works in both development and production
  return '/api'
}

const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

console.log('[API Client] Base URL:', getBaseURL())

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // Get token from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
export { apiClient }
