import { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const initialState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  loading: true,
  isAuthenticated: false
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        loading: false
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      }
    case 'UPDATE_TOKEN':
      return {
        ...state,
        accessToken: action.payload
      }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          const response = await authAPI.getProfile()
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data.user,
              accessToken: token,
              refreshToken: localStorage.getItem('refreshToken')
            }
          })
        } catch (error) {
          // Token might be expired, try to refresh
          const refreshToken = localStorage.getItem('refreshToken')
          if (refreshToken) {
            try {
              const refreshResponse = await authAPI.refreshToken(refreshToken)
              const newToken = refreshResponse.data.accessToken
              localStorage.setItem('accessToken', newToken)
              
              // Get user profile with new token
              const profileResponse = await authAPI.getProfile()
              dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                  user: profileResponse.data.user,
                  accessToken: newToken,
                  refreshToken: refreshToken
                }
              })
            } catch (refreshError) {
              // Refresh failed, clear tokens
              localStorage.removeItem('accessToken')
              localStorage.removeItem('refreshToken')
              dispatch({ type: 'LOGOUT' })
            }
          } else {
            dispatch({ type: 'LOGOUT' })
          }
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      const { user, accessToken, refreshToken } = response.data
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, accessToken, refreshToken }
      })
      
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register(name, email, password)
      const { user, accessToken, refreshToken } = response.data
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, accessToken, refreshToken }
      })
      
      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = async () => {
    try {
      if (state.refreshToken) {
        await authAPI.logout(state.refreshToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      dispatch({ type: 'LOGOUT' })
      toast.success('Logged out successfully')
    }
  }

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData })
  }

  const refreshAccessToken = async () => {
    try {
      const response = await authAPI.refreshToken(state.refreshToken)
      const newToken = response.data.accessToken
      localStorage.setItem('accessToken', newToken)
      dispatch({ type: 'UPDATE_TOKEN', payload: newToken })
      return newToken
    } catch (error) {
      logout()
      throw error
    }
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    refreshAccessToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}