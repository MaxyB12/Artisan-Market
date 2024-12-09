import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext' // You'll need to create this

const customRender = (ui, { isAuthenticated = false, ...options } = {}) =>
  render(ui, {
    wrapper: ({ children }) => (
      <AuthProvider initialState={{ isAuthenticated }}>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </AuthProvider>
    ),
    ...options,
  })

export * from '@testing-library/react'
export { customRender as render }