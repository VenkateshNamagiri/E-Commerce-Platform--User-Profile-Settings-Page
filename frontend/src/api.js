import axios from 'axios'

// backend origin, used to build full URLs for uploaded images
export const API_BASE_URL = 'http://localhost:5000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  // no withCredentials/cookies anymore - JWT goes in the Authorization header instead
})

// ------------------------------------------------------------------
// Request interceptor - attach the access token to every outgoing call
// ------------------------------------------------------------------
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ------------------------------------------------------------------
// Response interceptor - if a call comes back 401 with code token_expired,
// silently use the refresh token to get a new one and retry the original
// request once. If the refresh itself fails, the user is logged out.
// ------------------------------------------------------------------
api.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config

    // Only an EXPIRED token should trigger a refresh. Other 401s are real
    // answers the page needs to see (wrong password on login, wrong current
    // password on the profile page) - refreshing/redirecting there would
    // hide the error message.
    const tokenExpired =
      error.response?.status === 401 && error.response?.data?.code === 'token_expired'

    if (tokenExpired && !original._retry) {
      original._retry = true
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) throw new Error('No refresh token available')

        const res = await axios.post(
          `${API_BASE_URL}/api/refresh`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        )

        const newToken = res.data.access_token
        localStorage.setItem('access_token', newToken)

        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        // refresh failed too (expired after 7 days, or missing) - log out
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default api
