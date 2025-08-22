import { describe, it, expect, vi } from "vitest";
import { MockedProvider } from '@apollo/client/testing'
import { render, mockUseParams } from '../test-utils'
import Ticket from '@/pages/Ticket'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ticketAllowComment, ticketClosed, ticketNotFound, ticketUnassigned, ticketWithAttachments, ticketWithContent } from "../fixtures/tickets";

// Silence toasts
vi.mock('notistack', () => ({ useSnackbar: () => ({ enqueueSnackbar: vi.fn() }) }))

// Spies for mutations
const assignSpy = vi.fn()
const addCommentSpy = vi.fn()
const resolveSpy = vi.fn()
const closeSpy = vi.fn()

vi.mock('@/graphql/mutations/assignTicket', () => ({
  useAssignTicket: () => ({ assignTicket: assignSpy, loading: false })
}))
vi.mock('@/graphql/mutations/addComment', () => ({
  useAddComment: () => ({ addComment: addCommentSpy, loading: false })
}))
vi.mock('@/graphql/mutations/resolveTicket', () => ({
  useResolveTicket: () => ({ resolveTicket: resolveSpy, isResolving: false })
}))
vi.mock('@/graphql/mutations/closeTicket', () => ({
  useCloseTicket: () => ({ closeTicket: closeSpy, isClosing: false })
}))

describe('Ticket Page', () => {
  it('shows loading then renders content', async () => {
    mockUseParams({ id: 2 })
    const mocks = [ticketWithContent]

    render(
      <MockedProvider mocks={mocks} addTypename>
        <Ticket />
      </MockedProvider>,
      { routerProps: { initialEntries: ['/tickets/2'] } }
    )

    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(await screen.findByText('Ticket Information')).toBeInTheDocument()
  })

  it('renders not found when API returns null', async () => {
    mockUseParams({ id: 404 })
    const mocks = [ticketNotFound]

    render(
      <MockedProvider mocks={mocks} addTypename>
        <Ticket />
      </MockedProvider>,
      { routerProps: { initialEntries: ['/tickets/404'] } }
    )

    expect(await screen.findByText('Ticket not found.')).toBeInTheDocument()
  })

  it('lists attachments when available', async () => {
    mockUseParams({ id: 3 })
    const mocks = [ticketWithAttachments]

    render(
      <MockedProvider mocks={mocks} addTypename>
        <Ticket />
      </MockedProvider>,
      { routerProps: { initialEntries: ['/tickets/3'] } }
    )

    expect(await screen.findByText('Attachments')).toBeInTheDocument()
    expect(screen.getByText('file1.pdf')).toBeInTheDocument()
    expect(screen.getByText('file2.png')).toBeInTheDocument()
  })

  it('shows Assign to Me for agents and calls assignTicket on click', async () => {
    mockUseParams({ id: 5 })
    const mocks = [ticketUnassigned]

    render(
      <MockedProvider mocks={mocks} addTypename>
        <Ticket />
      </MockedProvider>,
      {
        routerProps: { initialEntries: ['/tickets/5'] },
        authValue: { user: { id: 7, role: 'agent', fullName: 'Agent A' } }
      }
    )

    expect(await screen.findByText('Assigned Agent')).toBeInTheDocument()
    const btn = screen.getByRole('button', { name: /assign to me/i })
    btn.click()
    expect(assignSpy).toHaveBeenCalledTimes(1)
  })

  it('shows Add Response when allowed and calls addComment', async () => {
    mockUseParams({ id: 6 })
    const mocks = [ticketAllowComment]

    render(
      <MockedProvider mocks={mocks} addTypename>
        <Ticket />
      </MockedProvider>,
      { routerProps: { initialEntries: ['/tickets/6'] } }
    )

    expect(await screen.findByText('Add Response')).toBeInTheDocument()
    const textarea = screen.getByPlaceholderText(/type your response/i)
    const user = userEvent.setup()
    await user.type(textarea, 'Hello')
    await user.click(screen.getByRole('button', { name: /send response/i }))
    expect(addCommentSpy).toHaveBeenCalledTimes(1)
  })

  it('disables actions when ticket is closed', async () => {
    mockUseParams({ id: 7 })
    const mocks = [ticketClosed]

    render(
      <MockedProvider mocks={mocks} addTypename>
        <Ticket />
      </MockedProvider>,
      { routerProps: { initialEntries: ['/tickets/7'] } }
    )

    expect(await screen.findByText('Actions')).toBeInTheDocument()
    const resolveBtn = screen.getByRole('button', { name: /resolved/i })
    expect(resolveBtn).toBeDisabled()
    expect(screen.queryByRole('button', { name: /close/i })).toBeNull()
  })
})