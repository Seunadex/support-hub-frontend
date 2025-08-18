import { gql, useMutation } from "@apollo/client";
import { GET_TICKETS } from "@/graphql/queries/getTickets";

const CREATE_TICKET = gql`
  mutation CreateTicket($title: String!, $description: String!, $category: String!, $priority: String!) {
    createTicket(input: { title: $title, description: $description, category: $category, priority: $priority }) {
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
    createTicket: (formData) => createTicket({ variables: { ...formData } })
  };
};
