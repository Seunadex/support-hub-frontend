

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import TicketCard from '@/components/TicketCard'
import { describe, it, expect } from "vitest";

const baseTicket = {
  id: 1,
  title: 'Printer not working',
  description: 'Paper jam in office printer',
  number: 'T-100',
  status: 'open',
  priority: 'high',
  createdAt: new Date().toISOString(),
  category: 'billing',
  assignedTo: { fullName: 'Agent Smith' },
  attachments: [{ id: 'a1' }, { id: 'a2' }]
}

describe('TicketCard', () => {
  it('renders ticket data correctly', () => {
    render(
      <MemoryRouter>
        <TicketCard ticket={baseTicket} />
      </MemoryRouter>
    )

    expect(screen.getByTestId('ticket-card')).toBeInTheDocument()
    expect(screen.getByText('Printer not working')).toBeInTheDocument()
    expect(screen.getByText('Paper jam in office printer')).toBeInTheDocument()
    expect(screen.getByText('T-100')).toBeInTheDocument()
    expect(screen.getByText(/Category:/)).toHaveTextContent('Category: Billing')
    expect(screen.getByText(/Agent:/)).toHaveTextContent('Agent: Agent Smith')
    expect(screen.getByLabelText('2 attachments')).toBeInTheDocument()
  })

  it('handles missing fields gracefully', () => {
    const incomplete = { id: null, title: '', description: '', number: null }
    render(
      <MemoryRouter>
        <TicketCard ticket={incomplete} />
      </MemoryRouter>
    )

    expect(screen.getByTestId('ticket-card')).toBeInTheDocument()
    expect(screen.getByText('#')).toBeInTheDocument()
    expect(screen.getByText('Category:')).toBeInTheDocument()
    expect(screen.getByText(/Agent:/)).toHaveTextContent('Agent: Unassigned')
  })

  it('links to ticket detail page', () => {
    render(
      <MemoryRouter>
        <TicketCard ticket={baseTicket} />
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: /open ticket/i })
    expect(link).toHaveAttribute('href', '/ticket/1')
  })
})