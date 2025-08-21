import { gql, useMutation } from "@apollo/client";
import { GET_TICKET } from "@/graphql/queries/getTicket";
import { GET_TICKET_STAT_COUNT } from "@/graphql/queries/getTicketStatCount";

const RESOLVE_TICKET = gql`
  mutation ResolveTicket($ticketId: ID!) {
    resolveTicket(input: { ticketId: $ticketId }) {
      success
      errors
    }
  }
`;

export const useResolveTicket = (ticketId, callbackAction) => {
  const [resolveTicket, { loading }] = useMutation(RESOLVE_TICKET, {
    variables: { ticketId },
    refetchQueries: [
      { query: GET_TICKET, variables: { id: ticketId } },
      { query: GET_TICKET_STAT_COUNT }
    ],
    onCompleted: (data) => {
      callbackAction(data);
    },
  });

  return { resolveTicket, isResolving: loading };
};
