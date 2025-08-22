

import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, afterEach } from 'vitest'
import Modal from '@/components/Modal'

afterEach(() => {
  cleanup()
})

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()} title="My Modal">
        <p>Body</p>
      </Modal>
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders title and children when open', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="My Modal">
        <p>Body</p>
      </Modal>
    )

    expect(screen.getByText('My Modal')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
    // Backdrop present
    expect(document.querySelector('.fixed.inset-0')).toBeTruthy()
  })

  it('invokes onClose when the close button is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(
      <Modal isOpen onClose={onClose} title="Close me">
        <p>Body</p>
      </Modal>
    )

    const closeBtn = screen.getByLabelText('Close modal')
    await user.click(closeBtn)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})