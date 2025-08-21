import { gql, useMutation } from "@apollo/client";
import { GET_TICKET } from "@/graphql/queries/getTicket";
import { GET_TICKET_STAT_COUNT } from "../queries/getTicketStatCount";

const CLOSE_TICKET = gql`
  mutation CloseTicket($ticketId: ID!) {
    closeTicket(input: { ticketId: $ticketId }) {
      success
      errors
    }
  }
`;

export const useCloseTicket = (ticketId, callbackAction) => {
  const [closeTicket, { loading }] = useMutation(CLOSE_TICKET, {
    variables: { ticketId },
    refetchQueries: [
      { query: GET_TICKET, variables: { id: ticketId } },
      { query: GET_TICKET_STAT_COUNT }
    ],
    onCompleted: (data) => {
      callbackAction(data);
    },
  });

  return { closeTicket, isClosing: loading };
};
