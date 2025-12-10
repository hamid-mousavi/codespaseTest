import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api'

const api = axios.create({ baseURL, withCredentials: true })

// Request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token && config.headers) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

// Response interceptor to handle 401 -> try refresh
api.interceptors.response.use(
  r => r,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      // Attempt refresh token flow (stub)
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const res = await axios.post('/api/auth/refresh', { token: refreshToken })
          localStorage.setItem('access_token', res.data.accessToken)
          originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`
          return axios(originalRequest)
        } catch (e) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
