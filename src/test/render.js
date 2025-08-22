import { MemoryRouter } from 'react-router'
import { MockedProvider } from '@apollo/client/testing'
import { SnackbarProvider } from 'notistack'
import { AuthContext } from '@/contexts/AuthContext'
import { render } from '@testing-library/react'

// Usage: renderWithProviders(ui, { route: '/tickets/1', apolloMocks, auth })
export function renderWithProviders(
  ui,
  {
    route = '/',
    apolloMocks = [],
    auth = { user: { id: 7, role: 'agent', fullName: 'Agent A' } }
  } = {}
) {
  window.history.pushState({}, '', route)

  return render(
    <SnackbarProvider>
      <AuthContext.Provider value={auth}>
        <MockedProvider mocks={apolloMocks} addTypename>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </MockedProvider>
      </AuthContext.Provider>
    </SnackbarProvider>
  )
}