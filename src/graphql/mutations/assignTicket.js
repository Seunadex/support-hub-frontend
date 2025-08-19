import { gql, useMutation } from "@apollo/client";
import { GET_TICKET } from "@/graphql/queries/getTicket";

const ASSIGN_TICKET = gql`
  mutation AssignTicket($ticketId: String!) {
    assignTicket(input: {ticketId: $ticketId}) {
      ticket {
        id
        assignedTo {
          id
          fullName
        }
      }
      errors
    }
  }
`;

export const useAssignTicket = (ticketId, callbackAction) => {
  const [assignTicket, { loading }] = useMutation(ASSIGN_TICKET, {
    onCompleted: (data) => {
      callbackAction(data.assignTicket);
    },
    onError: (error) => {
      // Handle error
    },
    variables: {
      ticketId,
    },
    refetchQueries: [
      {
        query: GET_TICKET,
        variables: { id: ticketId },
      },
    ],
  });
  return {
    loading,
    assignTicket,
  };
};
