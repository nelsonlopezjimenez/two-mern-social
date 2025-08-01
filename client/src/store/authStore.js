import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Set user and token
      setAuth: (user, token) => {
        set({ user, token, error: null })
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      },

      // Login action
      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await axios.post('/api/auth/login', credentials)
          const { data, token } = response.data
          
          get().setAuth(data, token)
          set({ isLoading: false })
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed'
          set({ error: message, isLoading: false })
          return { success: false, error: message }
        }
      },

      // Register action
      register: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await axios.post('/api/auth/register', userData)
          const { data, token } = response.data
          
          get().setAuth(data, token)
          set({ isLoading: false })
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed'
          set({ error: message, isLoading: false })
          return { success: false, error: message }
        }
      },

      // Logout action
      logout: async () => {
        try {
          await axios.post('/api/auth/logout')
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({ user: null, token: null, error: null })
          delete axios.defaults.headers.common['Authorization']
        }
      },

      // Get current user
      getCurrentUser: async () => {
        const { token } = get()
        if (!token) return

        set({ isLoading: true })
        try {
          const response = await axios.get('/api/auth/me')
          const { data } = response.data
          set({ user: data, isLoading: false })
        } catch (error) {
          console.error('Get current user error:', error)
          get().logout()
          set({ isLoading: false })
        }
      },

      // Clear error
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      })
    }
  )
)

export { useAuthStore }