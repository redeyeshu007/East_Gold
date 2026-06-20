import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config/env'

/**
 * Pre-configured Axios instance.
 * Import this anywhere you need to call the backend API.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the auth token (if present) to every outgoing request.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/** Fired when an authenticated request is rejected (expired/invalid session). */
export const AUTH_UNAUTHORIZED_EVENT = 'admin-unauthorized'

// Centralized response/error handling.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear the session and let the admin UI redirect to the login screen.
      localStorage.removeItem('auth_token')
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))
    }
    return Promise.reject(error)
  },
)

export default apiClient
