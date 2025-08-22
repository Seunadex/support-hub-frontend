import { graphql } from "msw";

export const handlers = [
  graphql.query("GetTicket", (req, res, ctx) => {
    const { id } = req.variables;
    return res(
      ctx.data({
        ticket: {
          __Typename: "Ticket",
          id,
          title: "Sample Ticket",
          description: "This is a sample ticket description.",
          number: "SPT-1234",
          status: "open",
          priority: "high",
          createdAt: new Date().toISOString(),
          category: "billing",
          agentHasReplied: false,
          customer: {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            role: "customer",
            __Typename: "User",
          },
          assignedTo: null,
          firstResponseAt: null,
          attachments: [],
          canClose: true,
          canResolve: false,
          agentCanComment: true,
          customerCanComment: false,
          comments: []
        },
      }),
    );
  }),
  graphql.mutation("AddComment", (req, res, ctx) => {
    const { ticketId, body } = req.variables;

    return res(
      ctx.data({
        addComment: {
          id: "1",
          ticketId,
          body,
          createdAt: new Date().toISOString(),
        },
      })
    );
  }),
];
