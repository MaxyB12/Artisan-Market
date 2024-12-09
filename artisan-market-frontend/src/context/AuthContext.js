import React, { createContext, useContext } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children, initialState = { isAuthenticated: false } }) => {
  const [auth, setAuth] = React.useState(initialState)
  
  return (
    <AuthContext.Provider value={{ ...auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}