import { vi } from "vitest"
export const createMockAuthValue = (overrides = {}) => ({
  user: {
    id: '1',
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    email: 'john.doe@example.com',
    role: 'customer',
    ...overrides.user
  },
  login: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: true,
  loading: false,
  ...overrides
})

// const agentAuth = createMockAuthValue({
//   user: { role: 'agent', name: 'Support Agent' }
// })

// render(<Component />, { authValue: agentAuth })