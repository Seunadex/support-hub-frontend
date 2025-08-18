import { gql, useMutation } from "@apollo/client";
import { GET_TICKETS } from "@/graphql/queries/getTickets";

const CREATE_TICKET = gql`
  mutation CreateTicket($title: String!, $description: String!, $category: String!, $priority: String!, $attachments: [Upload!]) {
    createTicket(input: { title: $title, description: $description, category: $category, priority: $priority, attachments: $attachments }) {
      ticket {
        id
        title
        description
        category
        priority
        status
      }
      errors
    }
  }
`;

export const useCreateTicket = (callbackAction) => {
  const [createTicket, { loading, error }] = useMutation(CREATE_TICKET, {
    context: {
      headers: {
        "X-Operation-Name": "CreateTicket",
      },
    },
    onCompleted: (data) => {
      callbackAction(data);
    },
    refetchQueries: [
          {
            query: GET_TICKETS,
          },
        ],
  });

  return {
    loading,
    error,
    createTicket: (formData) => {
      const variables = { ...formData };
      if(!variables.attachments || variables.attachments.length === 0) {
        delete variables.attachments;
      }

      console.log(variables, 'eeee');
      return createTicket({ variables });
    }
  };
};
