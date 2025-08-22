import { GET_TICKET } from '@/graphql/queries/getTicket'

const ticketWithContent = {
  request: { query: GET_TICKET, variables: { id: 2 } },
  result: {
    data: {
      ticket: {
        id: '2',
        title: 'Printer',
        description: 'Paper jam',
        number: 'T-2',
        status: 'open',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        category: 'hardware',
        agentHasReplied: true,
        customer: { id: '9', firstName: 'Jane', role: 'customer' },
        assignedTo: null,
        firstResponseAt: null,
        attachments: [],
        canClose: true,
        canResolve: true,
        agentCanComment: true,
        customerCanComment: false,
        comments: []
      }
    }
  }
}

const ticketNotFound = {
  request: { query: GET_TICKET, variables: { id: 404 } },
  result: { data: { ticket: null } }
}

const ticketWithAttachments = {
  request: { query: GET_TICKET, variables: { id: 3 } },
  result: {
    data: {
      ticket: {
        id: '3',
        title: 'Attachment test',
        description: 'desc',
        number: 'T-3',
        status: 'open',
        priority: 'low',
        createdAt: new Date().toISOString(),
        category: 'hardware',
        agentHasReplied: false,
        customer: { id: '1', firstName: 'John', role: 'customer' },
        assignedTo: null,
        firstResponseAt: null,
        attachments: [
          { id: 'a1', url: 'http://x/file1.pdf', filename: 'file1.pdf' },
          { id: 'a2', url: 'http://x/file2.png', filename: 'file2.png' }
        ],
        canClose: false,
        canResolve: false,
        agentCanComment: false,
        customerCanComment: false,
        comments: []
      }
    }
  }
}

const ticketUnassigned = {
  request: { query: GET_TICKET, variables: { id: 5 } },
  result: {
    data: {
      ticket: {
        id: '5',
        title: 'Unassigned',
        description: 'desc',
        number: 'T-5',
        status: 'open',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        category: 'hardware',
        agentHasReplied: false,
        customer: { id: '1', firstName: 'John', role: 'customer' },
        assignedTo: null,
        firstResponseAt: null,
        attachments: [],
        canClose: false,
        canResolve: false,
        agentCanComment: false,
        customerCanComment: false,
        comments: []
      }
    }
  }
}

const ticketAllowComment = {
  request: { query: GET_TICKET, variables: { id: 6 } },
  result: {
    data: {
      ticket: {
        id: '6',
        title: 'Allow comment',
        description: 'desc',
        number: 'T-6',
        status: 'waiting_on_customer',
        priority: 'high',
        createdAt: new Date().toISOString(),
        category: 'billing',
        agentHasReplied: true,
        customer: { id: '1', firstName: 'John', role: 'customer' },
        assignedTo: { id: '1', firstName: 'Agent B', role: 'agent' },
        firstResponseAt: new Date().toISOString(),
        attachments: [],
        canClose: false,
        canResolve: false,
        agentCanComment: true,
        customerCanComment: true,
        comments: [
          {
            id: 'c1',
            body: 'This is a comment',
            author: { id: '1', firstName: 'Agent B', role: 'agent' },
            createdAt: new Date().toISOString()
          }
        ]
      }
    }
  }
}

const ticketClosed = {
  request: { query: GET_TICKET, variables: { id: 7 } },
  result: {
    data: {
      ticket: {
        id: '7',
        title: 'Closed Ticket',
        description: 'This ticket is closed',
        number: 'T-7',
        status: 'closed',
        priority: 'low',
        createdAt: new Date().toISOString(),
        category: 'hardware',
        agentHasReplied: true,
        customer: { id: '1', firstName: 'John', role: 'customer' },
        assignedTo: { id: '1', firstName: 'Agent B', role: 'agent' },
        firstResponseAt: new Date().toISOString(),
        attachments: [],
        canClose: false,
        canResolve: false,
        agentCanComment: false,
        customerCanComment: false,
        comments: []
      }
    }
  }
}

export { ticketWithContent, ticketNotFound, ticketWithAttachments, ticketUnassigned, ticketAllowComment, ticketClosed }
