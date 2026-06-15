import axios from 'axios'

// Single axios instance. withCredentials so the httpOnly admin cookie flows.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

// Normalize error messages from the API.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.message || err?.message || 'Something went wrong'
    return Promise.reject(Object.assign(err, { message }))
  }
)

export default api
