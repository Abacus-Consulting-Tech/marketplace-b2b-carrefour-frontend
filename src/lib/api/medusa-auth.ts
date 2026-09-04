import axios from 'axios'
import { getBackendBaseUrl } from './api-utils'

const medusaAuthClient = axios.create({
  baseURL: getBackendBaseUrl('/backend'),
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for Medusa session cookies
})

export interface MedusaAuthResponse {
  token?: string
  user: {
    id: string
    email: string
    first_name?: string
    last_name?: string
    role?: string
    metadata?: {
      role?: string
      company_name?: string
      [key: string]: unknown
    }
  }
}

export interface MedusaLoginInput {
  email: string
  password: string
}

/**
 * Authenticate user with the preferred unified auth contract.
 * Falls back to the legacy Medusa admin endpoint when needed.
 */
export const medusaLogin = async (input: MedusaLoginInput): Promise<MedusaAuthResponse> => {
  try {
    const response = await medusaAuthClient.post<{ success?: boolean; data?: MedusaAuthResponse } | MedusaAuthResponse>('/auth/login', input)
    if ('data' in response.data) {
      if (!response.data.data) {
        throw new Error('Unified login response did not include auth data')
      }

      return response.data.data
    }

    return response.data as MedusaAuthResponse
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 405)) {
      const fallbackResponse = await medusaAuthClient.post<MedusaAuthResponse>('/auth/user/emailpass', input)
      return fallbackResponse.data
    }

    throw error
  }
}

/**
 * Get current authenticated user session
 * Endpoint: GET /auth/session
 */
export const getMedusaSession = async (): Promise<MedusaAuthResponse | null> => {
  try {
    const response = await medusaAuthClient.get<MedusaAuthResponse>('/auth/session')
    return response.data
  } catch (error) {
    return null
  }
}

/**
 * Logout current user
 * Endpoint: DELETE /auth/session
 */
export const medusaLogout = async (): Promise<void> => {
  await medusaAuthClient.delete('/auth/session')
}

/**
 * Register new user (if backend supports customer registration)
 * Endpoint: POST /auth/user/emailpass/register
 */
export interface MedusaRegisterInput {
  email: string
  password: string
  first_name?: string
  last_name?: string
}

export const medusaRegister = async (input: MedusaRegisterInput): Promise<MedusaAuthResponse> => {
  const response = await medusaAuthClient.post<MedusaAuthResponse>('/auth/user/emailpass/register', input)
  return response.data
}

export default medusaAuthClient
