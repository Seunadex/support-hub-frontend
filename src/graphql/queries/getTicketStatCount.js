import { gql, useQuery } from "@apollo/client";

export const GET_TICKET_STAT_COUNT = gql`
  query GetTicketStatCount {
    ticketStatCount {
      total
      open
      pending
      completed
    }
  }
`;

export const useGetTicketStatCount = () => {
  const { data, loading, error } = useQuery(GET_TICKET_STAT_COUNT, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true
  });
  return { data, loading, error };
};