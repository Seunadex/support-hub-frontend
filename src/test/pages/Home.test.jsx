import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/test/test-utils'

// Mock snackbar
const enqueueSnackbarMock = vi.fn()
vi.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: enqueueSnackbarMock })
}))

// Mock Form to avoid complex file inputs; invoke createTicket when its button is clicked
vi.mock('@/components/Form', () => ({
  default: ({ createTicket }) => (
    <div>
      <button onClick={() => createTicket({})}>Mock Create</button>
    </div>
  )
}))

// Tickets hook
const getTicketsMock = vi.fn()
vi.mock('@/graphql/queries/getTickets', () => ({
  useGetTickets: () => getTicketsMock()
}))

// Stats hook
const getStatsMock = vi.fn()
vi.mock('@/graphql/queries/getTicketStatCount', () => ({
  useGetTicketStatCount: () => getStatsMock()
}))

// Create ticket hook that calls the provided onCompleted callback
let createTicketSpy
vi.mock('@/graphql/mutations/createTicket', () => ({
  useCreateTicket: (onCompleted) => {
    createTicketSpy = vi.fn(async () => {
      // simulate server success
      const ticket = ticketWithContent.result.data.ticket
      onCompleted?.({ createTicket: { ticket: ticket, errors: [] } })
      return { data: { createTicket: { ticket: ticket, errors: [] } } }
    })
    return { createTicket: createTicketSpy, loading: false, error: null }
  }
}))

// Export closed tickets
let exportSpy
vi.mock('@/graphql/mutations/exportClosedTickets', () => ({
  useExportClosedTickets: () => {
    exportSpy = vi.fn(async () => ({
      data: { exportClosedTickets: { csvUrl: 'http://x.csv', filename: 'tickets.csv', count: 5, errors: [] } }
    }))
    return { exportClosedTickets: exportSpy, isExporting: false }
  }
}))

// After mocks, import the component under test
import Home from '@/pages/Home'
import { ticketWithContent } from '../fixtures/tickets'

beforeEach(() => {
  enqueueSnackbarMock.mockClear()
})

describe('Home page', () => {
  it('renders Home page without crashing', () => {
    getTicketsMock.mockReturnValue({ tickets: [ticketWithContent.result.data.ticket], loading: false })
    getStatsMock.mockReturnValue({ data: { ticketStatCount: { total: 1, open: 1, pending: 0, completed: 0 } }, loading: false })

    render(<Home />, { authValue: { user: { id: 1, role: 'customer', fullName: 'Test User' } } })

    const cards = screen.getAllByTestId('ticket-card')
    expect(cards).toHaveLength(1)

    expect(screen.getByText("Your Support Tickets")).toBeInTheDocument()
  })
})
