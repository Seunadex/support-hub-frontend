

import { render, screen } from '@testing-library/react'
import CommentCard from '@/components/CommentCard'
import { describe, it, expect } from "vitest";

const baseComment = {
  body: 'Hello world',
  createdAt: new Date().toISOString(),
  author: {
    fullName: 'Jane Doe',
    role: 'customer',
    avatarUrl: ''
  }
}

describe('CommentCard', () => {
  it('renders customer comment with name, role and body', () => {
    render(<CommentCard comment={baseComment} />)
    expect(screen.getByTestId('comment-author')).toHaveTextContent('Jane Doe')
    expect(screen.getByText('Customer')).toBeInTheDocument()
    expect(screen.getByTestId('comment-body')).toHaveTextContent('Hello world')
  })

  it('renders agent comment with proper badge and styles', () => {
    const agentComment = { ...baseComment, author: { ...baseComment.author, role: 'agent', fullName: 'Agent A' } }
    render(<CommentCard comment={agentComment} />)
    expect(screen.getByTestId('comment-author')).toHaveTextContent('Agent A')
    expect(screen.getByText('Support Agent')).toBeInTheDocument()
    const container = screen.getByLabelText('Support Agent comment')
    expect(container.className).toMatch(/bg-violet-50/)
  })

  it('falls back when author info missing', () => {
    const noAuthor = { body: 'No author', createdAt: '', author: {} }
    render(<CommentCard comment={noAuthor} />)
    expect(screen.getByTestId('comment-author')).toHaveTextContent('Unknown')
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('moments ago')).toBeInTheDocument()
  })

  it('renders avatar image when avatarUrl provided', () => {
    const withAvatar = { ...baseComment, author: { ...baseComment.author, avatarUrl: 'http://example.com/avatar.png' } }
    render(<CommentCard comment={withAvatar} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'http://example.com/avatar.png')
    expect(img).toHaveAttribute('alt', 'Jane Doe')
  })
})