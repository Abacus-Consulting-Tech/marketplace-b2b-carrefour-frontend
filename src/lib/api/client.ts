import axios from 'axios'

// In development, use relative URLs that go through Next.js rewrites
// In production, use the full backend URL (requires CORS)
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'development') {
    // Use Next.js proxy in development (no CORS needed)
    return '/backend'
  }
  // In production, call backend directly (CORS required)
  return process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-b2b-backend-dev.onrender.com'
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
