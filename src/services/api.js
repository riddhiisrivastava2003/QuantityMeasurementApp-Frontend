import axios from 'axios'

const BASE_URL = 'https://api-gateway-p6i7.onrender.com/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qma_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) localStorage.removeItem('qma_token')
    return Promise.reject(err)
  }
)

// ── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: async (username, password) => {
    const res = await api.post('/auth/login', { username, password })
    return res.data
  },
  register: async (username, password, email) => {
    const res = await api.post('/auth/register', { username, password, email })
    return res.data
  },
  logout: async (token) => {
    const res = await api.post('/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
  getProfile: async (token) => {
    const res = await api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  },
}

// ── Quantity / Conversion ───────────────────────────────────────────────────
export const quantityAPI = {
  // Convert units (public)
  convert: async ({ value, fromUnit, toUnit }) => {
    const res = await api.post('/quantity/convert', { value, fromUnit, toUnit })
    return res.data
  },

  // Arithmetic — ADD two quantities with units
  add: async ({ value1, unit1, value2, unit2, resultUnit }) => {
    const res = await api.post('/quantity/arithmetic/add', { value1, unit1, value2, unit2, resultUnit })
    return res.data
  },

  // Arithmetic — SUBTRACT
  subtract: async ({ value1, unit1, value2, unit2, resultUnit }) => {
    const res = await api.post('/quantity/arithmetic/subtract', { value1, unit1, value2, unit2, resultUnit })
    return res.data
  },

  // Arithmetic — MULTIPLY by scalar
  multiply: async ({ value1, unit1, scalar }) => {
    const res = await api.post('/quantity/arithmetic/multiply', { value1, unit1, scalar })
    return res.data
  },

  // Arithmetic — DIVIDE by scalar
  divide: async ({ value1, unit1, scalar }) => {
    const res = await api.post('/quantity/arithmetic/divide', { value1, unit1, scalar })
    return res.data
  },

  // Arithmetic — COMPARE two quantities
  compare: async ({ value1, unit1, value2, unit2 }) => {
    const res = await api.post('/quantity/arithmetic/compare', { value1, unit1, value2, unit2 })
    return res.data
  },

  getAll: async () => {
    const res = await api.get('/quantity/all')
    return res.data
  },

  health: async () => {
    const res = await api.get('/quantity/test')
    return res.data
  },
}

// ── History ─────────────────────────────────────────────────────────────────
export const historyAPI = {
  save: async (data) => {
    const res = await api.post('/history/save', data)
    return res.data
  },
  getMyHistory: async () => {
    const res = await api.get('/history/my')
    return res.data
  },
  clearHistory: async () => {
    const res = await api.delete('/history/clear')
    return res.data
  },
}

export default api
